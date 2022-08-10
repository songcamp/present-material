import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
import { Networks, Strategies } from "@zoralabs/nft-hooks"
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { Header } from '../components/Header'
import UserNFTs from '../components/UserNFTs';
import Link from 'next/link';
import Image from 'next/image';
import * as presentMaterialsCurator from "../contractABI/presentMaterialsCurator.json"

const Manage: NextPage = () => {

    const [collection, setCollection] = useState({
        collectionAddress: ""
    })

    const { address: account } = useAccount(); 
    const currentUserAddress = account ? account : ""
    console.log("currentUseraddress: ", currentUserAddress)

    // Query array of all active curators
    const { data, isError, isLoading, isSuccess, isFetching  } = useContractRead({
        addressOrName: "0xE5D36DF3087C19f108BBA4bb0D79143b8b4725Bb", // PresentMaterialsCurator https://rinkeby.etherscan.io/address/0xe5d36df3087c19f108bba4bb0d79143b8b4725bb#writeContract
        contractInterface: presentMaterialsCurator.abi,
        functionName: 'viewAllCollections',
        watch: true,
        onError(error) {
            console.log("error: ", isError)
        },
        onSuccess(data) {
            console.log("Array of current collections --> ", data)
        }  
    })

    const collectionData = data ? data : []
    

    // add collection call
    const { 
        data: addCollectionData, 
        isError: addCollectionError, 
        isLoading: addCollectionLoading, 
        write: addCollectionWrite 
    } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: "0xE5D36DF3087C19f108BBA4bb0D79143b8b4725Bb", // PresentMaterialsCurator https://rinkeby.etherscan.io/address/0xe5d36df3087c19f108bba4bb0d79143b8b4725bb#writeContract
        contractInterface: presentMaterialsCurator.abi,
        functionName: 'addCurator',
        args: [
            collection.collectionAddress,
            currentUserAddress,
        ]
    })    

    // remove collection call
    const { 
        data: removeCollectionData, 
        isError: removeCollectionError, 
        isLoading: removeCollectionLoading, 
        write: removeCollectionWrite 
    } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: "0xE5D36DF3087C19f108BBA4bb0D79143b8b4725Bb", // PresentMaterialsCurator // https://rinkeby.etherscan.io/address/0xe5d36df3087c19f108bba4bb0d79143b8b4725bb#writeContract
        contractInterface: presentMaterialsCurator.abi,
        functionName: 'removeCurator',
        args: [
            collection.collectionAddress,
            currentUserAddress,
        ]
    })        

    // const divCity = (collections) => {
    //     collections.map((collection, index)) => {
    //         <div key={collection}>
    //             <div>
    //                 {collection}
    //             </div>
    //         </div>
    //     }
    // }

    const showActiveCollections = () => {
        if (collectionData.length === 0) {
            return (
                <div>
                    No Active Collections
                </div>
            )
        } else {
            return (
                collectionData.map((collection, index) => {
                    return (
                        <div>
                            {(index + 1) + ". " + collection}
                        </div>
                    )
                })                
            )
        }
    }


    return (
        <div className=' h-screen min-h-screen '>
            <Head>
                <title>present materials</title>
                <meta name="description" content="present materials" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header/>
            <main className=" h-[100%] flex flex-col flex-wrap text-[#00c2ff]">
                <div className="z-10 bg-[url('/access_token_1.png')] bg-cover h-full w-6/12 flex flex-col flex-wrap justify-center items-center">                
                </div>
                <div className="w-6/12 h-full  flex flex-col flex-wrap justify-center items-center">
                    {/* <div className="w-[20%] min-w-[200px] text-center mb-1">
                        <Image  width={500}
                            height={500} src="https://ipfs.io/ipfs/bafybeihtbkqe27zo32njducvwncl73mmzj5w5ag634r7y5g6yykfdlfh3y" />
                    </div> */}
                    <div className="mb-2 text-4xl" >
                    {"STORE FRONT MANAGER"}
                    </div>
                    <div className="mb-20 text-lg" >
                    {"If you own $PRESENT you can update the storefront"}
                    </div>
                    <div className="mb-2 flex flex-row">
                        <div className="mb-2 flex items-center  text-lg" >
                        {"Are you a manager ? "}
                        </div>
                        <div className=" bg-[#00c2ff] text-black rounded mb-2  w-fit px-1  justify-self-center  ml-1 flex items-center">
                            {"YES/NO"}
                        </div>
                    </div>
                    <input         
                        required
                        type="text"           
                        className=" bg-black placeholder:text-[#005C77] border-[#00c2ff] text-[#00c2ff] border-2 border-solid pl-[1px] mb-4"
                        placeholder='Contract Address'
                        value={collection.collectionAddress}
                        onChange={(e) => {
                            e.preventDefault();
                            setCollection(current => {
                                return {
                                    ...current,
                                    collectionAddress: e.target.value
                                }
                            })
                        }}
                    >
                    </input>
                    <div className="space-x-2">
                        <button 
                            className="w-[100px] mb-2 border-2 border-solid border-[#00c2ff] hover:bg-[#00c2ff] hover:text-black"
                            onClick={() => addCollectionWrite()}
                        >
                            Add
                        </button>
                        <button 
                            className="w-[100px] mb-2 border-2 border-solid border-[#00c2ff] hover:bg-[#00c2ff] hover:text-black"
                            onClick={() => removeCollectionWrite()}
                        >
                            Remove
                        </button>             
                    </div>
                    <div className="flex flex-row flex-wrap mt-20 justify-center">
                        <div className="text-center text-3xl mb-2 w-full">
                            ACTIVE COLLECTIONS:
                        </div>
                        <div>
                            {showActiveCollections()}
                        </div>
                    </div>                                 
                </div>
            </main>
        </div>
    )
}

export default Manage
