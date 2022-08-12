import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from "next/link"
import { useContractRead, useAccount, useContractWrite } from "wagmi"
import { Networks, NFTFetchConfiguration, Strategies, useNFT, useNFTMetadata, MediaFetchAgent } from "@zoralabs/nft-hooks"
import { BigNumber } from "ethers"
import { useState, useEffect } from 'react'
import { createClient } from "urql"
import useAppContext from '../context/useAppContext'
import zoraDropsABI from "@zoralabs/nft-drop-contracts/dist/artifacts/ERC721Drop.sol/ERC721Drop.json"
import { ethers } from 'ethers'
import MintQuantity from './MintQuantity'

const vibes = "#ffffff"

// API
const ZORA_DROPS_MAINNET = "https://api.thegraph.com/subgraphs/name/iainnash/zora-editions-mainnet"

const client = createClient({
    url: ZORA_DROPS_MAINNET,
})


const EditionCard = ({ editionAddress }) => {

    const { mintQuantity, setMintQuantity } = useAppContext()

    const [loading, setLoading] = useState(false)

    const [editionReturns, setEditonReturns] = useState(null)
    const [editionsImageSRC, setEditionsImageSRC] = useState("/placeholder_400_400.png");
    const [editionsAnimationSRC, setEditionsAnimationSRC] = useState("");
    const [editionSalesInfo, setEditionSalesInfo] = useState({
        "name": "",
        "symbol": "",
        "creator": "",
        "maxSupply": "",
        "totalMinted": "",
        "publicSalePrice": "",
        "publicSaleStart": "",
        "publicSaleEnd": ""
    })

    const shortenAddress = (address) => {
        const shortenedAddress = address.slice(0, 4) + "..." + address.slice(address.length - 4)
        return shortenedAddress
    }

    // const editionReturnsMetadata = editionReturns ? editionReturns.editionMetadata.ImageURI : ""

    // console.log("edition resunts metadadta ", editionReturnsMetadata)
    // const addressToQuery = editionAddress ? editionAddress : ""

    const editionQuery =  
        `query {        
            erc721Drops(
                orderBy: createdAt
                orderDirection: desc
                where: {address: "${editionAddress}"}
            ) {
                name
                owner
                symbol
                salesConfig {
                    publicSalePrice
                    publicSaleStart
                    publicSaleEnd
                }
                address
                maxSupply
                totalMinted
                editionMetadata {
                    imageURI
                    animationURI
                    contractURI
                    description
                }
                creator
            }                 
        }`    

    const editionPromise = client.query(editionQuery).toPromise()

    const runningPromise = async () => { 
        return editionPromise.then((result) => {
            console.log("waht what the fucking reuslt", result)
            return result
        })
    }

    const cleanData = (input) => {
        console.log("What is the inptu", input)

        const newData = input.data.erc721Drops[0]
        console.log("brooo", newData)
        return newData
    }
    
    const handleIpfsHash = (hashington) => {
        console.log("hashington: ", hashington)
        const hash = hashington
        const cleanedHash = hash.slice(7)
        console.log("cleanedHash", cleanedHash);
        const fullURL = "https://ipfs.io/ipfs/" + cleanedHash
        console.log("full url", fullURL)
        return fullURL
    }

    const fetchData = async () => {
        console.log("fetching data")
        try {
            setLoading(true);
            const queryResults = await runningPromise()
            const happy = cleanData(queryResults)
            console.log("happy", happy)
            setEditonReturns(happy)

            const imageURI = happy.editionMetadata.imageURI
            console.log("imageURI:", imageURI)
            const imageIPFSGateway = handleIpfsHash(imageURI)
            setEditionsImageSRC(imageIPFSGateway)


            const animationURI = happy.editionMetadata.animationURI
            console.log("animationURI:", animationURI)
            const animnationIPFSGateway = handleIpfsHash(animationURI)
            console.log("animationgaeteay", animnationIPFSGateway)
            setEditionsAnimationSRC(animnationIPFSGateway)

            const editionSalesInfo = {
                "name": happy.name,
                "symbol": happy.symbol,
                "creator": happy.creator,
                "maxSupply": happy.maxSupply,
                "totalMinted": happy.totalMinted,
                "publicSalePrice": happy.salesConfig.publicSalePrice,
                "publicSaleStart": happy.salesConfig.publicSaleStart,
                "publicSaleEnd": happy.salesConfig.publicSaleEnd,
            }
            console.log("sales info: ", editionSalesInfo)
            setEditionSalesInfo(editionSalesInfo);


        } catch(error){
            console.error(error.message);
        } finally {
            setLoading(false)
        } 
    }


// ZORA NFT Mint Calls

    // edition collection 1
    const edition1SalePriceConverted = Number(editionSalesInfo.publicSalePrice)
    const edition1TotalMintPrice = String(mintQuantity.queryValue * edition1SalePriceConverted)
    const edition1MintValue = BigNumber.from(ethers.utils.parseEther(edition1TotalMintPrice)).toString()

    const { 
        data: mintData, 
        isError: mintError, 
        isLoading: mintLoading, 
        isSuccess: mintSuccess, 
        status: mintStatus, 
        write: mintWrite
        } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: editionAddress,
        contractInterface: zoraDropsABI.abi,
        functionName: 'purchase',
        args: [
            mintQuantity.queryValue
        ],
        overrides: {
            value: edition1MintValue
        },
        onError(error, variables, context) {
            console.log("error", error)
        },
        onSuccess(cancelData, variables, context) {
            console.log("Success!", cancelData)
        },
    })

    useEffect(() => {
        fetchData();
        }, 
        []
    )


    return (
        <>
            {
                !!editionAddress ? (
                    <>
                        {loading ? (
                        <div>
                        loading . . .
                        </div>   
                        ) : (
                        <div  className="h-[100%] w-[100%] text-white flex flex-row flex-wrap justify-center ">
                            <div className="relative flex flex-row ">
                                <Image 
                                    src={editionsImageSRC}
                                    // layout={"fill"}
                                    width={400}
                                    height={400}                                                        
                                />                            
                            </div>
                            <audio
                                className=" mt-5  flex flex-row w-full mx-[20%] justify-center"
                                controls
                                src={editionsAnimationSRC}
                            >
                            </audio>
                            <div
                                className="mt-5 flex flex-row h-fit flex-wrap w-full justify-center"
                            >
                                <div className="flex flex-row w-full justify-center ">
                                    {"Track : " + editionSalesInfo.name + " ($" + editionSalesInfo.symbol + ")"}
                                </div>
                                <div className="flex flex-row w-full justify-center">
                                    {"Artist : " + shortenAddress(editionSalesInfo.creator)}
                                </div>
                                <div className="flex flex-row w-full justify-center">
                                    {editionSalesInfo.totalMinted + " | " + editionSalesInfo.maxSupply + " Minted"}
                                </div>
                            </div>
                            <div className="mt-4 w-full flex flex-row justify-center">
                                <MintQuantity colorScheme={vibes}/>
                                <button 
                                className="flex flex-row justify-self-start  text-2xl  p-3  w-fit h-fit border-2 border-solid border-white hover:bg-white hover:text-black"
                                onClick={() => mintWrite()}   
                                >
                                Mint
                                </button>
                            </div>     
                        </div>                              
                        )}
                    </>                           
                ) : (
                <div>
                    {"::: NO RESULTS :::"}
                </div>
                )
            }
        </>
    )

}

export default EditionCard