import Image from 'next/image'
import { useContractWrite, useContractRead, useWaitForTransaction } from "wagmi"
import { BigNumber } from "ethers"
import { useState, useEffect } from 'react'
import { createClient } from "urql"
import zoraDropsABI from "@zoralabs/nft-drop-contracts/dist/artifacts/ERC721Drop.sol/ERC721Drop.json"
import { ethers } from 'ethers'
import MintQuantityV2 from './MintQuantityV2'
import PostMintDialog from './PostMintDialog'

const vibes = "#ffffff"

// API SETUP
const ZORA_DROPS_MAINNET = "https://api.thegraph.com/subgraphs/name/iainnash/zora-editions-mainnet"
const ZORA_DROPS_RINKEBY = "https://api.thegraph.com/subgraphs/name/iainnash/erc721droprinkeby"

const client = createClient({
    // url: ZORA_DROPS_MAINNET
    url: ZORA_DROPS_RINKEBY
})


// Mint Quantity Options
const sortOptions = [
    { name: 'QUANTITY', queryValue: 0 },
    { name: '1', queryValue: 1 },
    { name: '2', queryValue: 2 },
    { name: '3', queryValue: 3 },
    { name: '4', queryValue: 4 },
    { name: '5', queryValue: 5 }
]

const EditionCard = ({ editionAddress }) => {

    const [mintQuantity, setMintQuantity] = useState({ name: 'Quantity', queryValue: 0 })
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

    // Query array of all active curators
    const { data, isError, isLoading, isSuccess, isFetching  } = useContractRead({
        addressOrName: `${editionAddress}`, 
        contractInterface: zoraDropsABI.abi,
        functionName: 'totalSupply',
        watch: true,
        onError(error) {
            console.log("error: ", isError)
        },
        onSuccess(data) {
            // console.log("quantity minted from collection --> ", data)
        }  
    })

    const totalSupply = data ? BigNumber.from(data).toString() : []    

    const shortenAddress = (address) => {
        const shortenedAddress = address.slice(0, 4) + "..." + address.slice(address.length - 4)
        return shortenedAddress
    }

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
            return result
        })
    }

    const cleanData = (input) => {
        const cleanedData = input.data.erc721Drops[0]
        return cleanedData
    }
    
    const handleIpfsHash = (ipfsURL) => {
        const hash = ipfsURL
        const cleanedHash = hash.slice(7)
        const fullURL = "https://ipfs.io/ipfs/" + cleanedHash
        return fullURL
    }

    const fetchData = async () => {
        console.log("fetching data")
        try {
            setLoading(true);
            const queryResults = await runningPromise()
            const cleanedQueryResults = cleanData(queryResults)
            setEditonReturns(cleanedQueryResults)

            const imageURI = cleanedQueryResults.editionMetadata.imageURI
            const imageIPFSGateway = handleIpfsHash(imageURI)
            setEditionsImageSRC(imageIPFSGateway)

            const animationURI = cleanedQueryResults.editionMetadata.animationURI
            const animnationIPFSGateway = handleIpfsHash(animationURI)
            setEditionsAnimationSRC(animnationIPFSGateway)

            const editionSalesInfo = {
                "name": cleanedQueryResults.name,
                "symbol": cleanedQueryResults.symbol,
                "creator": cleanedQueryResults.creator,
                "maxSupply": cleanedQueryResults.maxSupply,
                "totalMinted": cleanedQueryResults.totalMinted,
                "publicSalePrice": cleanedQueryResults.salesConfig.publicSalePrice,
                "publicSaleStart": cleanedQueryResults.salesConfig.publicSaleStart,
                "publicSaleEnd": cleanedQueryResults.salesConfig.publicSaleEnd,
            }
            setEditionSalesInfo(editionSalesInfo);

        } catch(error){
            console.error(error.message);
        } finally {
            setLoading(false)
        } 
    }


    // ZORA NFT DROPS Mint Call

    const editionSalePriceConverted = Number(editionSalesInfo.publicSalePrice)
    const editionTotalMintPrice = String(mintQuantity.queryValue * editionSalePriceConverted)
    const editionMintValue = BigNumber.from(ethers.utils.parseEther(editionTotalMintPrice)).toString()

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
            value: editionMintValue
        },
        onError(error, variables, context) {
            console.log("error", error)
        },
        onSuccess(cancelData, variables, context) {
            console.log("Success!", cancelData)
        },
    })

    // Wait for data from mint call
    const { data: mintWaitData, isError: mintWaitError, isLoading: mintWaitLoading } = useWaitForTransaction({
        hash:  mintData?.hash,
        onSuccess(mintWaitData) {
            console.log("txn complete: ", mintWaitData)
            console.log("txn hash: ", mintWaitData.transactionHash)
        }
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
                            <div className="mt-4 w-full flex flex-row justify-center">
                                <MintQuantityV2 mintQuantityCB={setMintQuantity} colorScheme={vibes}/>
                                <button 
                                className="flex flex-row justify-self-start  text-2xl  p-3  w-fit h-fit border-2 border-solid border-white hover:bg-white hover:text-black"
                                onClick={() => mintWrite()}   
                                >
                                Mint
                                </button>
                            </div>     
                            <PostMintDialog 
                                publicTxnLoadingStatus={mintWaitLoading}
                                publicTxnSuccessStatus={mintStatus}
                                publicTxnHashLink={mintWaitData}
                                colorScheme={vibes}
                                editionAddress={editionAddress}                            
                            />
                            { mintWaitLoading == true ? (
                                <div className="flex flex-col flex-wrap justify-center">           
                                    <div className='flex flex-row justify-center flex-wrap'>
                                        <img
                                        className="bg-[#000] rounded-full p-1 mt-1" 
                                        width="25px"
                                        src="/SVG-Loaders-master/svg-loaders/tail-spin.svg"
                                        />
                                    </div>
                                </div>
                                ) : (                  
                                <div className="flex flex-col flex-wrap justify-center h-0">
                                </div>
                            )}                                                            
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
                                    {totalSupply + " | " + editionSalesInfo.maxSupply + " Minted"}
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