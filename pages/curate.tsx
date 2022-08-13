import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { Header } from '../components/Header'
import * as presentMaterialsCurator from "../contractABI/presentMaterialsCurator.json"
import { GetSpecificCurator } from '../components/ActiveCollections';

const allContent = "#00C2FF"
const clickables = "#7DE0FF"
const background = "#0E0411"

const Curate: NextPage = () => {

    const [collection, setCollection] = useState({
        collectionAddress: ""
    })

    const { address: account } = useAccount({}); 
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
                        <div key={collection} className="w-full">
                            <GetSpecificCurator index={index} collectionToCheck={collection} />                             
                        </div>
                    )
                })                
            )
        }
    }


    return (
        <div className=' h-screen min-h-screen bg-[#0E0411] scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-800'>
            <Head>
                <title>present materials</title>
                <meta name="description" content="present materials" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header/>
            <main className={` h-[100%] flex flex-row sm:flex-col flex-wrap text-[#00C2FF]`}>
                <div className="z-1 bg-[url('/access_token_1.png')] bg-contain sm:bg-cover h-[50%] sm:h-full w-full sm:w-6/12 flex flex-row flex-wrap justify-center items-center">                
                </div>
                <div className="flex flex-col flex-wrap  sm:h-full  w-full sm:w-6/12  justify-start sm:justify-center items-center">
                    <div className=" text-center  mb-5 sm:mb-2 text-4xl" >
                    {"CURATION MANAGER"}
                    </div>
                    <div className=" text-center mb-5 sm:mb-20 text-lg" >
                    {"If you own $PRESENT you can update the "}
                        <a 
                        className="underline hover:text-[#7DE0FF]"
                        href="https://rinkeby.etherscan.io/address/0xE5D36DF3087C19f108BBA4bb0D79143b8b4725Bb"
                        >
                        storefront
                        </a>                    
                    </div>
                    <div className="mb-2 flex flex-row">
                        <div className="mb-2 flex items-center  text-lg" >
                        {"Are you a manager -> "}
                        </div>
                        <div className=" bg-[#00c2ff] text-black rounded mb-2  w-fit px-1  justify-self-center  ml-1 flex items-center">
                            {"YES/NO"}
                        </div>
                    </div>
                    <input         
                        required
                        type="text"           
                        className={`bg-[#1a0121] placeholder:text-[#005C77] border-[#00C2FF] border-2 border-solid pl-[1px] mb-4`}
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
                            className="w-[100px] mb-2 border-2 border-solid border-[#00c2ff] hover:bg-[#7DE0FF] hover:border-[#7DE0FF] hover:text-black"
                            onClick={() => addCollectionWrite()}
                        >
                            Add
                        </button>
                        <button 
                            className="w-[100px] mb-2 border-2 border-solid border-[#00c2ff] hover:bg-[#7DE0FF] hover:border-[#7DE0FF] hover:text-black"
                            onClick={() => removeCollectionWrite()}
                        >
                            Remove
                        </button>             
                    </div>
                    <div className=" flex flex-row w-full flex-wrap mt-5 sm:mt-20 justify-center">
                        <div className="text-center text-3xl mb-2 w-full">
                            ACTIVE COLLECTIONS:
                        </div>
                        <div className="justify-center">
                            {showActiveCollections()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Curate
