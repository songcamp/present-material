import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
import { Networks, Strategies } from "@zoralabs/nft-hooks"
import { erc721ABI, useAccount, useContractRead, useContractWrite } from 'wagmi'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

import { useAppContext } from '../context/useAppContext';
import MintQuantity from '../components/MintQuantity';
import { BigNumber, utils } from 'ethers';
import zoraDropsABI from "@zoralabs/nft-drop-contracts/dist/artifacts/ERC721Drop.sol/ERC721Drop.json"
import * as flexibleEditionMetadataRenderer from "../contractABI/flexibleEditionMetadataRenderer.json"
const FlexibleEditionMetadataRenderer_ADDRESS_RINKEBY = "0x395488b2a175aEb5c007d314304e51a9d094c950"
const edition1_address = "0xa88b28061ad8d614d641a9eab66c1401ad0edde8"
const edition2_address = "0x6486aa21d5f5c1a851df21854c1a51e5b515ec3f"
const edition3_address = "0x7b9376f6d44b1eb17ffc3e176e0e33b66bab9cfc"
import * as presentMaterialsCurator from "../contractABI/presentMaterialsCurator.json"

import EditionCard from '../components/EditionCard';

const vibes = "#ffffff"

const Home: NextPage = () => {

  const { mintQuantity, setMintQuantity } = useAppContext()

  interface songMetadata {
    title: any,
    artist: any,
    duration: any,
    description: any,
    image: any,
    animation_uri: any
  }  

  const [edition1SongMetadata, setEdition1SongMetadata] = useState<songMetadata>({
    "title": "",
    "artist": "",
    "duration": "",
    "description": "",
    "image": "",
    "animation_uri": ""
  })

  const [edition2SongMetadata, setEdition2SongMetadata] = useState<songMetadata>({
    "title": "",
    "artist": "",
    "duration": "",
    "description": "",
    "image": "",
    "animation_uri": ""
  })
  const [edition3SongMetadata, setEdition3SongMetadata] = useState<songMetadata>({
    "title": "",
    "artist": "",
    "duration": "",
    "description": "",
    "image": "",
    "animation_uri": ""
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
      // console.log("edition1 inmfo", edition1Data)
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
      // console.log("edition2 inmfo", edition2Data)
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
      // console.log("edition3 inmfo", edition3Data)
    }  
  })  

  // data validation for uri information

  const edition1ImageCID = edition1Data ? edition1Data.imageURI.slice(7) : ""
  const edition2ImageCID = edition2Data ? edition2Data.imageURI.slice(7) : ""
  const edition3ImageCID = edition3Data ? edition3Data.imageURI.slice(7) : ""

  const edition1AnimationCID = edition1Data ? edition1Data.animationURI.slice(7) : ""
  const edition2AnimationCID = edition2Data ? edition2Data.animationURI.slice(7) : ""
  const edition3AnimationCID = edition3Data ? edition3Data.animationURI.slice(7) : ""

  const edition1MetadataCID = edition1Data ? edition1Data.metadataURI.slice(7) : ""
  const edition2MetadataCID = edition2Data ? edition2Data.metadataURI.slice(7) : ""
  const edition3MetadataCID = edition3Data ? edition3Data.metadataURI.slice(7) : ""

  // URI Related Fetching

  const fetchEdition1Info = () => {
    const ipfsPathway = `https://ipfs.io/ipfs/${edition1MetadataCID}`
    // console.log("ipfspathway1 url: ", ipfsPathway)
    fetch(ipfsPathway)
      .then(result => result.json())
      .then((output) => {
        // console.log("output1 :", output)
        setEdition1SongMetadata(output)
      }).catch(err => console.error(err))
    
  }

  const fetchEdition2Info = () => {
    const ipfsPathway = `https://ipfs.io/ipfs/${edition2MetadataCID}`
    // console.log("ipfspathway2 url: ", ipfsPathway)
    fetch(ipfsPathway)
      .then(result => result.json())
      .then((output) => {
        // console.log("output2 :", output)
        setEdition2SongMetadata(output)
      }).catch(err => console.error(err))
  }
  
  const fetchEdition3Info = () => {
    const ipfsPathway = `https://ipfs.io/ipfs/${edition3MetadataCID}`
    // console.log("ipfspathway3 url: ", ipfsPathway)
    fetch(ipfsPathway)
      .then(result => result.json())
      .then((output) => {
        // console.log("output3 :", output)
        setEdition3SongMetadata(output)
      }).catch(err => console.error(err))
  }  

  // const runTheJewels = () => {
  //   fetchEdition1Info()
  //   fetchEdition2Info()
  //   fetchEdition3Info()
  // }

  // saleDetai related info

  // Get saleDetails for edition collection 1
  const { data: edition1SalesData, isError: edition1SalesError, isLoading: edition1SalesLoading, isSuccess: edition1SalesSuccess, isFetching: edition1SalesFetching  } = useContractRead({
    addressOrName: edition1_address,
    contractInterface: zoraDropsABI.abi,
    functionName: 'saleDetails',
    watch: true,
    onError(error) {
      console.log("error: ", edition1SalesError)
    },
    onSuccess(data) {
      console.log("edition1Sales inmfo", edition1SalesData)
    }  
  })

  // Get saleDetails for edition collection 2
  const { data: edition2SalesData, isError: edition2SalesError, isLoading: edition2SalesLoading, isSuccess: edition2SalesSuccess, isFetching: edition2SalesFetching  } = useContractRead({
    addressOrName: edition2_address,
    contractInterface: zoraDropsABI.abi,
    functionName: 'saleDetails',
    watch: true,
    onError(error) {
      console.log("error: ", edition2SalesError)
    },
    onSuccess(data) {
      console.log("edition2Sales inmfo", edition2SalesData)
    }  
  })
  
  // Get saleDetails for edition collection 3
  const { data: edition3SalesData, isError: edition3SalesError, isLoading: edition3SalesLoading, isSuccess: edition3SalesSuccess, isFetching: edition3SalesFetching  } = useContractRead({
    addressOrName: edition3_address,
    contractInterface: zoraDropsABI.abi,
    functionName: 'saleDetails',
    watch: true,
    onError(error) {
      console.log("error: ", edition3SalesError)
    },
    onSuccess(data) {
      // console.log("edition3Sales inmfo", edition3SalesData)
    }  
  })    

  // data validation for salesDetails
  const edition1SaleActive = edition1SalesData ? edition1SalesData.publicSaleActive : ""
  const edition1SaleMaxSupply = edition1SalesData ? BigNumber.from(edition1SalesData.maxSupply).toString() : ""
  const edition1SalePrice = edition1SalesData ? utils.formatEther(BigNumber.from(edition1SalesData.publicSalePrice).toString()) : ""
  const edition1SaleTotalMinted = edition1SalesData ? BigNumber.from(edition1SalesData.totalMinted).toString() : ""

  const edition2SaleActive = edition2SalesData ? edition2SalesData.publicSaleActive : ""
  const edition2SaleMaxSupply = edition2SalesData ? BigNumber.from(edition2SalesData.maxSupply).toString() : ""
  const edition2SalePrice = edition2SalesData ? utils.formatEther(BigNumber.from(edition2SalesData.publicSalePrice).toString()) : ""
  const edition2SaleTotalMinted = edition2SalesData ? BigNumber.from(edition2SalesData.totalMinted).toString() : ""
  
  const edition3SaleActive = edition3SalesData ? edition3SalesData.publicSaleActive : ""
  const edition3SaleMaxSupply = edition3SalesData ? BigNumber.from(edition3SalesData.maxSupply).toString() : ""
  const edition3SalePrice = edition3SalesData ? utils.formatEther(BigNumber.from(edition3SalesData.publicSalePrice).toString()) : ""
  const edition3SaleTotalMinted = edition3SalesData ? BigNumber.from(edition3SalesData.totalMinted).toString() : ""

  // ZORA NFT Mint Calls

  // edition collection 1
  const edition1SalePriceConverted = Number(edition1SalePrice)
  const edition1TotalMintPrice = String(mintQuantity.queryValue * edition1SalePriceConverted)
  const edition1MintValue = BigNumber.from(utils.parseEther(edition1TotalMintPrice)).toString()

  const { 
    data: mintData1, 
    isError: mintError1, 
    isLoading: mintLoading1, 
    isSuccess: mintSuccess1, 
    status: mintStatus1, 
    write: mintWrite1
  } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: edition1_address,
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

  // edition collection 2
  const edition2SalePriceConverted = Number(edition2SalePrice)
  const edition2TotalMintPrice = String(mintQuantity.queryValue * edition2SalePriceConverted)
  const edition2MintValue = BigNumber.from(utils.parseEther(edition2TotalMintPrice)).toString()

  const {     
    data: mintData2, 
    isError: mintError2, 
    isLoading: mintLoading2, 
    isSuccess: mintSuccess2, 
    status: mintStatus2, 
    write: mintWrite2
  } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: edition2_address,
    contractInterface: zoraDropsABI.abi,
    functionName: 'purchase',
    args: [
      mintQuantity.queryValue
    ],
    overrides: {
      value: edition2MintValue
    },
    onError(error, variables, context) {
      console.log("error", error)
    },
    onSuccess(cancelData, variables, context) {
      console.log("Success!", cancelData)
    },
  })

  // edition collection 3
  const edition3SalePriceConverted = Number(edition3SalePrice)
  const edition3TotalMintPrice = String(mintQuantity.queryValue * edition3SalePriceConverted)
  const edition3MintValue = BigNumber.from(utils.parseEther(edition3TotalMintPrice)).toString()

  const {     
    data: mintData3, 
    isError: mintError3, 
    isLoading: mintLoading3, 
    isSuccess: mintSuccess3, 
    status: mintStatus3, 
    write: mintWrite3
  } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: edition3_address,
    contractInterface: zoraDropsABI.abi,
    functionName: 'purchase',
    args: [
      mintQuantity.queryValue
    ],
    overrides: {
      value: edition3MintValue
    },
    onError(error, variables, context) {
      console.log("error", error)
    },
    onSuccess(cancelData, variables, context) {
      console.log("Success!", cancelData)
    },
  })  

  // pull in the proper info fam

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

  // read calllllllll

    // Query array of all active curators
    const { data: readData, isError: readError  } = useContractRead({
      addressOrName: "0xE5D36DF3087C19f108BBA4bb0D79143b8b4725Bb", // PresentMaterialsCurator https://rinkeby.etherscan.io/address/0xe5d36df3087c19f108bba4bb0d79143b8b4725bb#writeContract
      contractInterface: presentMaterialsCurator.abi,
      functionName: 'viewAllCollections',
      watch: true,
      chainId: 4,
      onError(error) {
          console.log("error: ", isError)
      },
      onSuccess(data) {
          console.log("Array of current collections --> ", data)
      }  
  })

  const curatorsData = data ? data : []  


  // useEffects
  useEffect(() => {
    if(!!edition1MetadataCID) {
      fetchEdition1Info()
    }},
    []
  )

  useEffect(() => {
    if(!!edition2MetadataCID) {
      fetchEdition2Info()
    }},
    []
  )
  
  useEffect(() => {
    if(!!edition3MetadataCID) {
      fetchEdition3Info()
    }},
    []
  )  


  return (
    <div className='flex flex-col justify-center h-full min-h-screen' >
      <Head>
        <title>Present Materials</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className=" border-white border-solid text-white grid  grid-rows-3 sm:grid-cols-3 h-fit ">        

      {
        curatorsData.map((curator, index) => {
          while (index < curatorsData.length) {
            return (
              <EditionCard editionAddress={curatorsData[index]} />
            )
          }
        })
      }

      </main>
    </div>
  )
}

export default Home
