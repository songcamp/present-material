import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Dispatch, useState, useEffect } from 'react'
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
import { NFTPreview, MediaConfiguration } from '@zoralabs/nft-components';
import { Networks, Strategies } from "@zoralabs/nft-hooks"
import mainnetZoraAddresses from "@zoralabs/v3/dist/addresses/1.json"
import asksABI from "@zoralabs/v3/dist/artifacts/AsksV1_1.sol/AsksV1_1.json"
import zmmABI from "@zoralabs/v3/dist/artifacts/ZoraModuleManager.sol/ZoraModuleManager.json"

import erc721abi from 'erc-token-abis/abis/ERC721Full.json'

import { erc721ABI, useAccount, useContractRead, useContractWrite } from 'wagmi'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import AskRead_disclosure from "../components/Asks/AskRead_disclosure"
import AskWrite_disclosure from '../components/Asks/AskWrite_disclosure';
import OffersRead_disclosure from "../components/Offers/OffersRead_disclosure"
import OffersWrite_disclosure from '../components/Offers/OffersWrite_disclosure';
import AuctionRead_disclosure from "../components/Auctions/AuctionRead_disclosure"
import AuctionWrite_disclosure from '../components/Auctions/AuctionWrite_disclosure'



import * as flexibleEditionMetadataRenderer from "../contractABI/flexibleEditionMetadataRenderer.json"
const FlexibleEditionMetadataRenderer_ADDRESS_RINKEBY = "0x395488b2a175aEb5c007d314304e51a9d094c950"
const edition1_address = "0xa88b28061ad8d614d641a9eab66c1401ad0edde8"
const edition2_address = "0x6486aa21d5f5c1a851df21854c1a51e5b515ec3f"
const edition3_address = "0x7b9376f6d44b1eb17ffc3e176e0e33b66bab9cfc"



const networkInfo = {
  network: ZDKNetwork.Ethereum,
  chain: ZDKChain.Mainnet,
}

const API_ENDPOINT = "https://api.zora.co/graphql";
const zdkArgs = {     
  endPoint: API_ENDPOINT, 
  networks: [networkInfo], 
} 



const zdkStrategyMainnet = new Strategies.ZDKFetchStrategy(
  Networks.MAINNET
)

const Collect: NextPage = () => {

  interface nftInfo {
    contractAddress: string,
    tokenId: string
  }

  interface nftABIInfo {
    nftABI: any
  }

  const [ asksNFT, setAsksNFT] = useState<nftInfo>({
    "contractAddress": "0x7e6663E45Ae5689b313e6498D22B041f4283c88A",
    "tokenId": "1"
  })

  const [ offersNFT, setOffersNFT] = useState<nftInfo>({
    "contractAddress": "0x7e6663E45Ae5689b313e6498D22B041f4283c88A",
    "tokenId": "2"
  })

  const [ auctionsNFT, setAuctionsNFT] = useState<nftInfo>({
    "contractAddress": "0x7e6663E45Ae5689b313e6498D22B041f4283c88A",
    "tokenId": "3"
  })

  // get account hook
  const { address, connector, isConnecting, isConnected, status} = useAccount(); 
  const currentUserAddress = address ? address : ""


  // Get uris for edition collection 1
  const { data: edition1Data, isError: edition1Error, isLoading: edition1Loading, isSuccess: edition1Success, isFetching: edition1Fetching  } = useContractRead({
    addressOrName: FlexibleEditionMetadataRenderer_ADDRESS_RINKEBY,
    contractInterface: flexibleEditionMetadataRenderer.abi,
    functionName: 'tokenInfos',
    args: [
      edition1_address
    ],
    onError(error) {
      console.log("error: ", edition1Error)
    },
    onSuccess(data) {
      console.log("edition1 inmfo", edition1Data)
    }  
  })

  // Get uris for edition collection 2
  const { data: edition2Data, isError: edition2Error, isLoading: edition2Loading, isSuccess: edition2Success, isFetching: edition2Fetching  } = useContractRead({
    addressOrName: FlexibleEditionMetadataRenderer_ADDRESS_RINKEBY,
    contractInterface: flexibleEditionMetadataRenderer.abi,
    functionName: 'tokenInfos',
    args: [
      edition2_address
    ],
    onError(error) {
      console.log("error: ", edition2Error)
    },
    onSuccess(data) {
      console.log("edition2 inmfo", edition2Data)
    }  
  })
  
  // Get uris for edition collection 3
  const { data: edition3Data, isError: edition3Error, isLoading: edition3Loading, isSuccess: edition3Success, isFetching: edition3Fetching  } = useContractRead({
    addressOrName: FlexibleEditionMetadataRenderer_ADDRESS_RINKEBY,
    contractInterface: flexibleEditionMetadataRenderer.abi,
    functionName: 'tokenInfos',
    args: [
      edition3_address
    ],
    onError(error) {
      console.log("error: ", edition3Error)
    },
    onSuccess(data) {
      console.log("edition3 inmfo", edition3Data)
    }  
  })  
  
  const edition1ImageCID = edition1Data ? edition1Data.imageURI.slice(7) : ""
  const edition2ImageCID = edition2Data ? edition2Data.imageURI.slice(7) : ""
  const edition3ImageCID = edition3Data ? edition3Data.imageURI.slice(7) : ""

  const edition1AnimationCID = edition1Data ? edition1Data.animationURI.slice(7) : ""
  const edition2AnimationCID = edition2Data ? edition2Data.animationURI.slice(7) : ""
  const edition3AnimationCID = edition3Data ? edition3Data.animationURI.slice(7) : ""


  return (
    <div className='flex flex-col justify-center h-full min-h-screen'>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="border-l-2 border-r-2 border-t-2 border-white border-solid text-white grid  grid-rows-3 sm:grid-cols-3 h-fit">        
        
        {/* ASKS MODULE */}
        {/* ASKS MODULE */}
        {/* ASKS MODULE */}

        <div className='mt-24 sm:mt-10 flex flex-row flex-wrap content-start'>
          <div className='h-fit content-start flex flex-row flex-wrap w-full'>
            <div className="text-2xl h-fit w-full flex flex-row justify-center">            
              ASKS MODULE
            </div>
            <div className=" justify-center border-2 border-white border-solid flex flex-row h-fit w-full">
              LIST AND BUY NFTs FOR A SPECIFIC PRICE
            </div>
            <div className="grid grid-cols-2 border-2 boreder-yellow-500 border-solid w-full" >
              <a
                href="https://github.com/0xTranqui/zora-starter-kit"
                className=" hover:cursor-pointer hover:text-[#f53bc3] text-center"
              >
                REPO
              </a>
              <a 
                href="https://etherscan.io/address/0x6170B3C3A54C3d8c854934cBC314eD479b2B29A3"
                className="hover:text-[#f53bc3] text-center"
              >
              ETHERSCAN
              </a>
            </div>
          </div>

          {/* NFT RENDERING + CONTRACT INPUTS */}
          <div className="mt-2  w-full h-fit flex flex-row flex-wrap justify-center "> 
            <Image
              src={`https://ipfs.io/ipfs/${edition1AnimationCID}`}
              width={400}
              height={400}
            />
            <audio
              className="my-2"
              controls
              src={`https://ipfs.io/ipfs/${edition1ImageCID}`}
            />              
            <div className="w-full flex flex-row flex-wrap justify-center">
              <div className="justify-center flex flex-row w-full">
                <div className="align-center">
                  CONTRACT ADDRESS
                </div>
                <input
                  className="border-[1px] border-solid border-black ml-2 text-black text-center bg-slate-200"
                  placeholder="Input NFT Address"
                  name="inputContract"
                  type="text"
                  value={asksNFT.contractAddress}
                  onChange={(e) => {
                      e.preventDefault();
                      setAsksNFT(current => {
                        return {
                          ...current,
                          contractAddress: e.target.value
                        }
                      })
                  }}
                  required                    
                >
                </input>
              </div>
              <div className="justify-center flex flex-row w-full">
                <div className=" mt-1 self-center">
                  TOKEN ID
                </div>
                <input
                  className="border-l-[1px] border-r-[1px] border-b-[1px] border-solid border-black ml-2 mt-2 flex flex-row align-center text-black text-center bg-slate-200"
                  placeholder="Input Token Id "
                  name="inputContract"
                  type="text"
                  value={asksNFT.tokenId}
                  onChange={(e) => {
                      e.preventDefault();
                      setAsksNFT(current => {
                        return {
                          ...current,
                          tokenId: e.target.value
                        }
                      })
                  }}
                  required                    
                >
                </input>
              </div>
              

            </div>                   
          </div>


        </div>

        {/* OFFERS MODULE */}
        {/* OFFERS MODULE */}
        {/* OFFERS MODULE */}

        <div className='sm:mt-10 '>
          <div className='h-fit content-start flex flex-row flex-wrap w-full'>
            <div className="text-2xl h-fit w-full flex flex-row justify-center">            
              OFFERS MODULE
            </div>
            <div className=" justify-center border-2 border-white border-solid flex flex-row h-fit w-full">
              MAKE AND RECIEVE OFFERS ON NFTs
            </div>
            <div className="grid grid-cols-2 border-2 boreder-yellow-500 border-solid w-full" >
            <a
                href="https://github.com/0xTranqui/zora-starter-kit"
                className=" hover:cursor-pointer hover:text-[#f53bc3] text-center"
              >
                REPO
              </a>
              <a 
                href="https://etherscan.io/address/0x76744367ae5a056381868f716bdf0b13ae1aeaa3"
                className="hover:text-[#f53bc3] text-center"
              >
              ETHERSCAN
              </a>
            </div>
          </div>

          {/* NFT RENDERING + CONTRACT INPUTS */}
          <div className="mt-2  border-l-2 border-r-2 border-b-2 border-solid border-white w-full h-fit flex flex-row flex-wrap justify-center "> 
            <Image
              src={`https://ipfs.io/ipfs/${edition2AnimationCID}`}
              width={400}
              height={400}
            />
            <audio
              className="my-2"
              controls
              src={`https://ipfs.io/ipfs/${edition2ImageCID}`}
            />        
            <div className="w-full flex flex-row flex-wrap justify-center">
            <div className="justify-center flex flex-row w-full">
                <div className="align-center">
                  CONTRACT ADDRESS
                </div>
                <input
                  className="border-[1px] border-solid border-black ml-2 text-black text-center bg-slate-200"
                  placeholder="Input NFT Address"
                  name="inputContract"
                  type="text"
                  value={offersNFT.contractAddress}
                  onChange={(e) => {
                      e.preventDefault();
                      setOffersNFT(current => {
                        return {
                          ...current,
                          contractAddress: e.target.value
                        }
                      })
                  }}
                  required                    
                >
                </input>
              </div>
              <div className="justify-center flex flex-row w-full">
                <div className=" mt-1 self-center">
                  TOKEN ID
                </div>
                <input
                  className="border-l-[1px] border-r-[1px] border-b-[1px] border-solid border-black ml-2 mt-2 flex flex-row align-center text-black text-center bg-slate-200"
                  placeholder="Input Token Id "
                  name="inputContract"
                  type="text"
                  value={offersNFT.tokenId}
                  onChange={(e) => {
                      e.preventDefault();
                      setOffersNFT(current => {
                        return {
                          ...current,
                          tokenId: e.target.value
                        }
                      })
                  }}
                  required                    
                >
                </input>
              </div>
                          

            </div>                    
          </div>
        </div>

        {/* AUCTION MODULE */}
        {/* AUCTION MODULE */}
        {/* AUCTION MODULE */}

        <div className='sm:mt-10 '>
          <div className='h-fit content-start flex flex-row flex-wrap w-full'>
            <div className="text-2xl h-fit w-full flex flex-row justify-center">            
              AUCTIONS MODULE
            </div>
            <div className=" justify-center border-2 border-white border-solid flex flex-row h-fit w-full">
              RUN AND BID ON AUCTIONS FOR NFTs
            </div>
            <div className="grid grid-cols-2 border-2 boreder-yellow-500 border-solid w-full" >
              <a
                href="https://github.com/0xTranqui/zora-starter-kit"
                className=" hover:cursor-pointer hover:text-[#f53bc3] text-center"
              >
                REPO
              </a>
              <a 
                href="https://etherscan.io/address/0x9458E29713B98BF452ee9B2C099289f533A5F377"
                className="hover:text-[#f53bc3] text-center"
              >
              ETHERSCAN
              </a>
            </div>
          </div>

          {/* NFT RENDERING + CONTRACT INPUTS */}              
          <div className="mt-2 w-full h-fit flex flex-row flex-wrap justify-center "> 
          <Image
              src={`https://ipfs.io/ipfs/${edition3AnimationCID}`}
              width={400}
              height={400}
            />
            <audio
              className="my-2"
              controls
              src={`https://ipfs.io/ipfs/${edition3ImageCID}`}
            />        
            <div className="w-full flex flex-row flex-wrap justify-center">
              <div className="justify-center flex flex-row w-full">
                <div className="align-center">
                  CONTRACT ADDRESS
                </div>
                <input
                  className="border-[1px] border-solid border-black ml-2 text-black text-center bg-slate-200"
                  placeholder="Input NFT Address"
                  name="inputContract"
                  type="text"
                  value={auctionsNFT.contractAddress}
                  onChange={(e) => {
                      e.preventDefault();
                      setAuctionsNFT(current => {
                        return {
                          ...current,
                          contractAddress: e.target.value
                        }
                      })
                  }}
                  required                    
                >
                </input>
              </div>
              <div className="justify-center flex flex-row w-full">
                <div className=" mt-1 self-center">
                  TOKEN ID
                </div>
                <input
                  className="border-l-[1px] border-r-[1px] border-b-[1px] border-solid border-black ml-2 mt-2 flex flex-row align-center text-black text-center bg-slate-200"
                  placeholder="Input Token Id "
                  name="inputContract"
                  type="text"
                  value={auctionsNFT.tokenId}
                  onChange={(e) => {
                      e.preventDefault();
                      setAuctionsNFT(current => {
                        return {
                          ...current,
                          tokenId: e.target.value
                        }
                      })
                  }}
                  required                    
                >
                </input>
              </div>
              
            </div>                   
          </div>              
          
        </div>
      </main>
    </div>
  )
}

export default Collect






// const Protocol: NextPage = () => {
//   const [userNFTs, setUserNFTs] = useState({});
//   const currentUserNFTs = userNFTs ? userNFTs: "nothing";

//   const { address: account } = useAccount(); 
//   const currentUserAddress = account ? account : ""
//   console.log("currentUseraddress: ", currentUserAddress)

//   const tokensResponse = async(args) => {
//     const response = Object.entries(await (await zdk.tokens(args)).tokens.nodes)
//     console.log("response", response)
//     console.log("userNFTs: ", userNFTs)
//     setUserNFTs(response)
//   }

//   const tokensArgs = {
//     where: {
//       ownerAddresses: [currentUserAddress]
//     },
//     pagination: {
//       limit: 10
//     },
//     includeFullDetails: false
//   }

//   useEffect(() => {
//     tokensResponse(tokensArgs)
//     },
//     []
//   )

//   useEffect(() => {
//     if(!!userNFTs) {
//     tokensResponse(tokensArgs)
//     }},
//     [currentUserAddress]
//   )


//   return (
//     <div className='flex flex-col justify-center h-screen min-h-screen'>
//       <Header />
//       <main className="flex flex-col items-center">        
//         <h1 className="text-white">
//           {`<<< ${currentUserNFTs} >>>`}
//         </h1>
//         <NFTCard nfts={currentUserNFTs} />
//         {/* <NFTCard nfts={currentUserNFTs} /> */}
//         {/* <NFTPreview
//           contract=`${userNFTs[0].token.collectionAddress}`
//           id=`${userNFTs[0].token.tokenId}`
//         /> */}
//       </main>
//     </div>
//   )
// }

// export default Protocol
