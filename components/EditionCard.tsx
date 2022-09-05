import Image from 'next/image'
import { useContractWrite, useContractRead, useWaitForTransaction } from "wagmi"
import { BigNumber } from "ethers"
import { useState, useEffect, useMemo } from 'react'
import { createClient } from "urql"
import zoraDropsABI from "@zoralabs/nft-drop-contracts/dist/artifacts/ERC721Drop.sol/ERC721Drop.json"
import { ethers } from 'ethers'
import MintQuantityV2 from './MintQuantityV2'
import { CustomAudioPlayer } from './CustomAudioPlayer'
import { EditionArtist } from './EditionArtist'

const vibes = "#ffffff"

// API SETUP
const ZORA_DROPS_MAINNET = "https://api.thegraph.com/subgraphs/name/iainnash/zora-editions-mainnet"
const ZORA_DROPS_RINKEBY = "https://api.thegraph.com/subgraphs/name/iainnash/erc721droprinkeby"
const ZORA_DROPS_GOERLI = "https://api.thegraph.com/subgraphs/name/iainnash/erc721drop-goerli"

const client = createClient({
    url: ZORA_DROPS_MAINNET
})

const EditionCard = ({ editionAddress }) => {

    const [mintQuantity, setMintQuantity] = useState({ name: '1', queryValue: 1 })
    const [loading, setLoading] = useState(false)
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
    const [mintOverlayState, setMintOverlayState] = useState(false);

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
    const totalMintValueEth = ethers.utils.formatUnits(editionTotalMintPrice)

    const { 
        data: mintData, 
        isError: mintError, 
        isLoading: mintLoading, 
        isSuccess: mintSuccess, 
        status: mintStatus, 
        error,
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
            value: editionTotalMintPrice
        },
        onError(error, variables, context) {
            console.log("error", JSON.stringify(error.message))
        },
        onSuccess(cancelData, variables, context) {
            console.log("Success!", cancelData)
        },
    })

    // handle loading state UI when minting
    const mintAndSetOverlayState = () => {
        mintWrite()
        setMintOverlayState(!mintOverlayState)
    }

    const clearLoadingState = () => {
        setMintOverlayState(!mintOverlayState);
    }    

    // Wait for data from mint call
    const { data: mintWaitData, isLoading: mintWaitLoading } = useWaitForTransaction({
        hash:  mintData?.hash,
        onSuccess(mintWaitData) {
            console.log("txn complete: ", mintWaitData)
            console.log("txn hash: ", mintWaitData.transactionHash)
        }
    })           

    // max supply check
    const maxSupplyCheck = (supply) => {
        if (supply == 18446744073709551615) {
            return "∞"
        } else {
            return supply
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
                        <div className="text-[#00C2FF]">
                        loading . . .
                        </div>   
                        ) : (
                        <div  className="   border-[1px] border-[#00C2FF] text-[#00C2FF] h-[100%] w-full text-[#00C2FF] flex flex-row flex-wrap justify-center ">
                            <div className=" flex flex-row sm:w-[100%] justify-center border-b-[1px] border-[#00C2FF]">
                                <div className="relative" style={{width: 354, height: 354 }}>
                                    <Image 
                                        src={editionsImageSRC}
                                        layout="fill"
                                        objectFit='cover'        
                                    />
                                </div>        
                            </div>
                            { mintWaitLoading == false && mintOverlayState == true && mintStatus == "success" ? (
                            <div className=" h-[268px] bg-[#00C2FF] flex flex-row sm:w-[100%] justify-center items-center  ">
                                <div className=" w-full  flex flex-row flex-wrap justify-center space-y-4">
                                    <div className="text-lg font-bold  flex flex-row w-full h-fit justify-center text-[#0E0411]">
                                        Mint Successful ☼☽
                                    </div>
                                    <a 
                                        className="decoration-1 text-sm pb-2 h-fit justify-center underline flex flex-row w-full text-[#0E0411]"
                                        href={"https://etherscan.io/tx/" + mintWaitData.transactionHash} 
                                    >
                                        View txn on Etherscan
                                    </a>
                                    <button
                                        onClick={() => clearLoadingState()}
                                        className=" h-fit text-[#00C2FF] border-[1px] border-[#0E0411] bg-[#0E0411] hover:bg-[#7DE0FF] hover:text-[#0E0411]  p-2 justify-center w-6/12 text-[16px] flex flex-row h-fit hover:text-[#7DE0FF]"
                                    >
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                            ) : (
                                <>
                                    { mintWaitLoading == false && mintOverlayState == true && mintStatus == "error" ? (                                                                    
                                    <div className="h-[268px] bg-[#00C2FF] flex flex-row w-full sm:w-[100%] justify-center items-center">
                                        <div className="my-4 w-full h-fit flex flex-row flex-wrap justify-center  space-y-4">
                                            <div className="text-lg font-bold  flex flex-row w-full h-fit justify-center text-[#0E0411]">
                                                Error in mint process
                                            </div>                           
                                            <button
                                                onClick={() => clearLoadingState()}
                                                className=" h-fit text-[#00C2FF] border-[1px] border-[#0E0411] bg-[#0E0411] hover:bg-[#7DE0FF] hover:text-[#0E0411]  p-2 justify-center w-6/12 text-[16px] flex flex-row h-fit hover:text-[#7DE0FF]"
                                            >
                                                CLOSE
                                            </button>
                                        </div>
                                    </div>                                                          
                                    ) : (
                                    <div className="w-full ">
                                        <CustomAudioPlayer  musicSRC={editionsAnimationSRC} />
                                        <div className=" flex flex-row flex-wrap w-full pb-4 space-y-2 ">
                                            <div className="ml-3 flex flex-row w-full text-xl">
                                                <a
                                                    className="hover:underline decoration-1"
                                                    href={"https://create.zora.co/editions/" + editionAddress}
                                                >
                                                    {editionSalesInfo.name}
                                                </a>
                                            </div>
                                            {editionSalesInfo?.creator && <EditionArtist creatorAddress={editionSalesInfo?.creator} />}                  
                                        </div>
                                        <div className=" justify-evenly flex flex-row flex-wrap w-full py-3 border-[1px] border-[#00C2FF]">
                                            <div
                                                className="flex flex-row  text-xl border-[#00C2FF] border-2 w-[25%] rounded  bg-[#00C2FF] justify-center text-center  text-black"
                                            >
                                                {"$" + editionSalesInfo.symbol}
                                            </div>
                                            <div className="flex flex-row  items-center justify-center text-xl ">
                                                {(totalSupply) + " / " + maxSupplyCheck(editionSalesInfo.maxSupply) + " MINTED"}
                                            </div>                                
                                        </div>                                                              
                                        <div className="w-full grid grid-cols-4 ">
                                            <MintQuantityV2 mintQuantityCB={setMintQuantity} colorScheme={vibes}/>                              
                                            <div 
                                                className="flex flex-row justify-center col-start-2 col-end-3  text-lg  p-3  w-full h-full border-[1px] border-solid border-[#00C2FF]"
                                            >
                                                {"" + totalMintValueEth + "Ξ"}
                                            </div>             

                                            { mintWaitLoading == true ? (
                                            <button 
                                                disabled={true}
                                                className="flex flex-row justify-center col-start-3 col-end-5  text-2xl p-3  w-full h-full border-[1px] border-solid border-[#00C2FF] hover:bg-[#7DE0FF] hover:text-black bg-[#00C2FF] text-black"
                                                // onClick={() => mintWrite()}   
                                            >
                                                <div className='flex flex-row justify-center flex-wrap'>
                                                    <img
                                                    className=" rounded-full p-1 mt-2" 
                                                    width="25px"
                                                    src="/SVG-Loaders-master/svg-loaders/tail-spin.svg"
                                                    />
                                                </div>
                                            </button>    
                                            ) : (                                                  
                                            <button 
                                                className="flex flex-row justify-center col-start-3 col-end-5  text-2xl p-3  w-full h-full border-[1px] border-solid border-[#00C2FF] hover:bg-[#7DE0FF] hover:text-black bg-[#00C2FF] text-black"
                                                onClick={() => mintAndSetOverlayState()}   
                                            >
                                                Mint
                                            </button>                                                                   
                                            )}              
                                        </div>  
                                    </div>                                   
                                    )}
                                </>
                            )}
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