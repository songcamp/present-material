import type { NextPage } from 'next'
import Image from 'next/image'
import Head from 'next/head'
import { useState } from 'react'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { Header } from '../components/Header'
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
        <div className=' h-screen  bg-[#0E0411] scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-600'>
            <Header/>            
            <Head>
                <title>present materials</title>
                <meta name="description" content="present materials" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={`mt-[80px] h-[90%] flex flex-row sm:flex-col flex-wrap text-[#00C2FF]`}>
                {/* <div className="z-1 h-full bg-[url('/graphics/access_token_final.jpg')] bg-contain sm:bg-cover w-full sm:w-7/12 flex flex-row flex-wrap justify-center items-center">                
                </div> */}
                <div className="relative z-1 h-[50%] sm:h-full  w-full sm:w-7/12 flex flex-row flex-wrap justify-center items-center">                
                    <Image
                        src={"/graphics/access_token_final.jpg"}
                        layout={"fill"}
                        />                
                </div>                
                <div className="z-1 flex flex-col flex-wrap  sm:h-full  w-full sm:w-5/12  justify-start sm:justify-center items-center">
                    <Image
                        src={"/Group.png"}
                        width={181}
                        height={73}
                    />
                    <div className=" text-xl mt-6 text-center mb-5 sm:mb-20 text-lg w-6/12" >
                        {"If you own "} 
                        <a 
                        className="hover:underline text-[#7DE0FF] hover:text-[#7DE0FF]"
                        href={"https://rinkeby.etherscan.io/address/" + tokeGateAddressCheck}
                        >
                        $PRESENT
                        </a>   
                        {" you can update the "}
                        <a 
                        className="text-[#7DE0FF] hover:underline hover:text-[#7DE0FF]"
                        href="https://rinkeby.etherscan.io/address/0x0D0A1da8Ef7882d0f2705bC936fE19462Ea99c39"
                        >
                        storefront
                        </a>                    
                    </div>
                    { tokenGateCheck > 0 ? (          
                    <div className="flex flex-row flex-wrap justify-center">          
                        <div className="mb-5 sm:mb-20 flex flex-row w-full justify-center">
                            <div className="font-[akzidenz] mb-2 flex items-center  text-xl" >
                            {"Are you a manager? "}  
                            </div>
                            <div className=" text-xl ml-8 bg-[#00c2ff] text-black  mb-2  w-fit px-1  justify-self-center flex items-center">
                                {"Yes"}
                            </div>
                        </div>                                        
                        <input         
                            required
                            type="text"           
                            className={`w-[60%] hover:border-[#7DE0FF] bg-[#1a0121] placeholder:text-[#1784A5] pl-1 hover:placeholder-text-[#7DE0FF] border-[#00C2FF] border-2 border-solid pl-[1px] mb-4`}
                            placeholder='ZORA Edition Address: 0xa97d . . .'
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
                        <div className=" flex justify-center w-full font-semibold">
                            <button 
                                className="w-[93px] h-[45px] mb-2 border-2 border-solid border-black bg-[#00C2FF] hover:bg-[#7DE0FF] hover:border-[#7DE0FF] text-black"
                                onClick={() => addCollectionWrite()}
                            >
                                Add
                            </button>
                            <button 
                                className="w-[93px] h-[45px] mb-2 border-2 border-solid border-black bg-[#00C2FF] hover:bg-[#7DE0FF] hover:border-[#7DE0FF] text-black"
                                onClick={() => removeCollectionWrite()}
                            >
                                Remove
                            </button>             
                        </div>
                    </div>
                    ) : ( 
                        <div>          
                            <div className="mb-2 flex flex-row flex-wrap justify-center">
                                <div className="mb-5 sm:mb-20 flex flex-row w-full justify-center">
                                    <div className="  flex flex-row self-center flex items-center  text-xl" >
                                    {"Are you a manager? "}  
                                    </div>
                                    <div className=" px-2 text-xl ml-8 bg-[#FF3D00] text-black    w-fit px-1  justify-self-center flex items-center">
                                        {"No"}
                                    </div>
                                </div> 
                                <input   
                                    disabled={true}      
                                    required
                                    type="text"           
                                    className={`w-[60%] bg-[#1a0121] placeholder:text-gray-600 pl-1 border-gray-600 border-2 border-solid pl-[1px] mb-4`}
                                    placeholder='ZORA Edition Address: 0xa97d . . .'
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
                                />
                                <div className=" flex justify-center w-full font-semibold">
                                    <button 
                                        disabled={true}
                                        className="w-[93px] h-[45px] mb-2 border-2 border-solid border-black bg-gray-600 text-black"
                                        onClick={() => addCollectionWrite()}
                                    >
                                        Add
                                    </button>
                                    <button 
                                        disabled={true}
                                        className="w-[93px] h-[45px] m-0 p-[0p] border-2 border-solid border-black bg-gray-600 text-black"
                                        onClick={() => removeCollectionWrite()}
                                    >
                                        Remove
                                    </button>             
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
