import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { Header } from '../components/Header'
import * as presentMaterialsCurator from "../contractABI/presentMaterialsCurator.json"
import * as presentMaterialsCuratorV2 from "../contractABI/presentMaterialsCuratorV2.json"
import { GetSpecificCurator } from '../components/GetSpecificCurator'
import { BigNumber } from 'ethers'

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
        addressOrName: "0x0D0A1da8Ef7882d0f2705bC936fE19462Ea99c39", // PresentMaterialsCurator https://rinkeby.etherscan.io/address/0xe5d36df3087c19f108bba4bb0d79143b8b4725bb#writeContract
        contractInterface: presentMaterialsCuratorV2.abi,
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

    // CuratorContract Read Call --> TokenGateBalanceCheck
    const { data: tokenGateData, isError: tokenGateError, isLoading: tokenGateLoading, isSuccess: tokenGateSuccess, isFetching: tokenGateFetching  } = useContractRead({
        addressOrName: "0x0D0A1da8Ef7882d0f2705bC936fE19462Ea99c39", // PresentMaterialsCurator https://rinkeby.etherscan.io/address/0xe5d36df3087c19f108bba4bb0d79143b8b4725bb#writeContract
        contractInterface: presentMaterialsCuratorV2.abi,
        functionName: 'viewUserBalanceOfTokenGate',
        watch: true,
        args: [
            currentUserAddress
        ],
        onError(tokenGateError) {
            console.log("error: ", tokenGateError)
        },
        onSuccess(tokenGateData) {
            // console.log("--> ", tokenGateData)
        }  
    })  

    const tokenGateCheck = tokenGateData ? BigNumber.from(tokenGateData).toBigInt() : 0

    // CuratorContract Read Call --> TokenGateAddress Check
    const { data: tokeGateAddressData, isError: tokeGateAddressError, isLoading: tokeGateAddressLoading, isSuccess: tokeGateAddressSuccess, isFetching: tokeGateAddressFetching  } = useContractRead({
        addressOrName: "0x0D0A1da8Ef7882d0f2705bC936fE19462Ea99c39", // PresentMaterialsCurator https://rinkeby.etherscan.io/address/0xe5d36df3087c19f108bba4bb0d79143b8b4725bb#writeContract
        contractInterface: presentMaterialsCuratorV2.abi,
        functionName: 'tokenGateAddress',
        watch: true,
        onError(tokeGateAddressError) {
            console.log("error: ", tokeGateAddressError)
        },
        onSuccess(tokeGateAddressData) {
            // console.log("tokenGateAddressCheck--> ", tokeGateAddressData)
        }  
    })  

    const tokeGateAddressCheck = tokeGateAddressData ? tokeGateAddressData.toString() : ""    


    // add collection call
    const { 
        data: addCollectionData, 
        isError: addCollectionError, 
        isLoading: addCollectionLoading, 
        write: addCollectionWrite 
    } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: "0x0D0A1da8Ef7882d0f2705bC936fE19462Ea99c39", // PresentMaterialsCurator https://rinkeby.etherscan.io/address/0xe5d36df3087c19f108bba4bb0d79143b8b4725bb#writeContract
        contractInterface: presentMaterialsCuratorV2.abi,
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
        addressOrName: "0x0D0A1da8Ef7882d0f2705bC936fE19462Ea99c39", // PresentMaterialsCurator // https://rinkeby.etherscan.io/address/0xe5d36df3087c19f108bba4bb0d79143b8b4725bb#writeContract
        contractInterface: presentMaterialsCuratorV2.abi,
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
                        href="https://rinkeby.etherscan.io/address/0x0D0A1da8Ef7882d0f2705bC936fE19462Ea99c39"
                        >
                        storefront
                        </a>                    
                    </div>
                    { tokenGateCheck > 0 ? (          
                    <div className="flex flex-row flex-wrap justify-center">          
                        <div className="mb-2 flex flex-row w-full justify-center">
                            <div className="mb-2 flex items-center  text-lg" >
                            {"Do you own "}  
                            <a
                                className="ml-1 mr-1 underline hover:text-[#7DE0FF]"
                                href={"https://rinkeby.etherscan.io/address/" + tokeGateAddressCheck}
                            >
                                {" $PRESENT "}    
                            </a>
                            {" -> "}
                            </div>
                            <div className=" bg-[#00c2ff] text-black rounded mb-2  w-fit px-1  justify-self-center  ml-1 flex items-center">
                                {"YES"}
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
                        <div className="space-x-2 flex justify-center w-full">
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
                    </div>
                    ) : (
                        <div>          
                            <div className="mb-2 flex flex-row flex-wrap justify-center">
                                <div className="flex flex-row w-full justify-center">
                                    <div className="mb-2 flex items-center  text-lg" >
                                    {"Do you own "}  
                                        <a
                                            className="ml-1 mr-1 underline hover:text-[#7DE0FF]"
                                            href={"https://rinkeby.etherscan.io/address/0x7B9376f6d44B1EB17FFC3E176e0E33B66BAB9cFC" + tokeGateAddressCheck}
                                        >
                                            {" $PRESENT "}    
                                        </a>
                                    {" -> "}
                                    </div>
                                    <div className=" bg-red-800 text-black rounded mb-2  w-fit px-1  justify-self-center  ml-1 flex items-center">
                                        {"NO"}
                                    </div>
                                </div>
                                <div className="mt-5 mb-2 flex items-center text-center text-lg" >
                                {"You do not have the ability to update the storefront"}
                                </div>                                
                            </div>
                        </div>                
                    )}
                </div>
            </main>
        </div>
    )
}

export default Curate
