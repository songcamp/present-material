import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from "next/link"
import { useContractRead, useAccount } from "wagmi"
import { Networks, NFTFetchConfiguration, Strategies, useNFT, useNFTMetadata, MediaFetchAgent } from "@zoralabs/nft-hooks"
import { BigNumber } from "ethers"
import { useState, useEffect } from 'react'
import { createClient } from "urql"


// API
const ZORA_DROPS_MAINNET = "https://api.thegraph.com/subgraphs/name/iainnash/zora-editions-mainnet"

const client = createClient({
    url: ZORA_DROPS_MAINNET,
})


const EditionCard = ({ editionAddress }) => {

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
                        <div  className="text-white flex flex-row flex-wrap justify-content">
                            <div>
                                <Image 
                                    src={editionsImageSRC}
                                    width={400}
                                    height={400}
                                />                            
                            </div>
                            <audio
                                controls
                                src={editionsAnimationSRC}
                            >
                            </audio>
                            <div>
                                <div>
                                    {"Track : " + editionSalesInfo.name}
                                </div>
                                <div>
                                    {"Artist : " + editionSalesInfo.creator}
                                </div>
                                <div>
                                    {"$" + editionSalesInfo.symbol}
                                </div>
                                <div>
                                    {editionSalesInfo.totalMinted + " | " + editionSalesInfo.maxSupply + " Minted"}
                                </div>
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