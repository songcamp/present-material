import { NextPage } from "next"
import { Header } from "../components/Header"
import { useState, useEffect } from "react"
import { usePrepareContractWrite, useContractWrite, useSwitchNetwork, useNetwork, useAccount, useConnect } from "wagmi"
import { InjectedConnector } from 'wagmi/connectors/injected'
import { utils } from "ethers"
import Image from "next/image"
import ReactAudioPlayer from 'react-audio-player'

import SongForm from "../components/SongForm"

const ZoraNFTCreatorV1_ABI = require("../node_modules/@zoralabs/nft-drop-contracts/dist/artifacts/ZoraNFTCreatorV1.sol/ZoraNFTCreatorV1.json")

console.log("abi:", ZoraNFTCreatorV1_ABI)

const ZoraNFTCreatorProxy_ADDRESS_RINKEBY = "0x2d2acD205bd6d9D0B3E79990e093768375AD3a30"
const ZoraNFTCreatorProxy_ADDRESS_MAINNET = "0xF74B146ce44CC162b601deC3BE331784DB111DC1"
const FlexibleEditionMetadataRenderer_ADDRESS_RINKEBY = "0x395488b2a175aEb5c007d314304e51a9d094c950" 
const FlexibleEditionMetadataRenderer_ADDRESS_MAINNET = "" // not deployed yet


const Create: NextPage = () => {

  // new state
  let [songForm, setSongForm] = useState(false);
  const [minting, setMinting] = useState([]);
  console.log(minting);

  const [metadataStatus, setMetadataStatus] = useState("No Files Uploaded")


  const [editionInputs, setEditionInputs] = useState({
    contractName: "Example Edition",
    contractSymbol: "EDTN",
    contractMaxSupply: "100",
    secondaryRoyalties: "500",
    fundsRecipient: "0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170",
    contractAdmin: "0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170",
    salesConfig: {
      priceEther: "0.001",
      perWalletMintCap: "5",
      publicSaleStart: "0", // makes it so edition will be live to start
      publicSaleEnd: "50000000000", // makes it so edition will be live to start
      presaleStart: "0",
      presaleEnd: "0",
      presaleMerkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000"
    },
    songMetadataURI: "contractURI/",
    metadataAnimationURI: "animationURI/",
    metadataImageURI: "imageURI/",
  })  

  const { chain } = useNetwork()

  // connect to network and call create drop flow (for when no wallet previously connected)
  const { connectAsync: connectToRinkeby } = useConnect({
    connector: new InjectedConnector,
    chainId: 4,
    onSettled(data, error, variables, context) {
      console.log("connect to mainnet settled: ", data)
    },
  })

  const { connectAsync: connectToMainnet } = useConnect({
    connector: new InjectedConnector,
    chainId: 1,
    onSettled(data, error, variables, context) {
      console.log("connect to mainnet settled: ", data)
    },
  })

  // switch network and call create drop flow (for when wallet already connected but to incorrect network)
  const { data: rinkebyChainData, switchNetworkAsync: switchToRinkeby } = useSwitchNetwork({
    chainId: 4,
    onSuccess(rinkebyChainData) {
      console.log("Success", rinkebyChainData)
    }
  })

  const { data: mainnetChainData, switchNetworkAsync: switchToMainnet } = useSwitchNetwork({
    chainId: 1,
    onSuccess(mainnetChainData) {
      console.log("Success", mainnetChainData)
    }
  })


  // connect to network and call create edition flow (for when no wallet previously connected)
  const connectToRinkebyAndEdition = async () => {
    await connectToRinkeby()
    rinkebyWrite()
  }

  const connectToMainnetAndEdition = async () => {
    await connectToMainnet()
    mainnetWrite()
  }

  // switch network and call edition drop flow (for when wallet already connected but to incorrect network)
  const switchToRinkebyAndEdition = async () => {
    await switchToRinkeby()
    rinkebyWrite()
  }

  const switchToMainnetAndEdition = async () => {
    await switchToMainnet()
    mainnetWrite()
  }

  // createEdition function used in button  
  const createEditionRinkeby = () => {
    if (!chain ) {
      connectToRinkebyAndEdition()
      return
    } else if (chain && chain.id !== 4) {
      switchToRinkebyAndEdition()
      return
    }
    rinkebyWrite()
  }

  const createEditionMainnet = () => {
    if (!chain ) {
      connectToMainnetAndEdition()
      return
    } else if (chain && chain.id !== 1) {
      switchToMainnetAndEdition()
      return
    }
    mainnetWrite()
  }


  const dealWithEther = (price) => {
    if (price === "") {
      return 0
    }
    return utils.parseEther(price)
  }

  const getCID = (inputIPFS) => {
    const cid = inputIPFS.slice(7) 
    return cid
  }


  // new calls - rinkeby
  const { config: rinkebyConfig, error: rinkebyError } = usePrepareContractWrite({
    addressOrName: ZoraNFTCreatorProxy_ADDRESS_RINKEBY,
    contractInterface: ZoraNFTCreatorV1_ABI.abi,
    functionName: 'setupDropsContract',
    args: [
      editionInputs.contractName,
      editionInputs.contractSymbol,
      editionInputs.contractAdmin,
      editionInputs.contractMaxSupply,
      editionInputs.secondaryRoyalties,
      editionInputs.fundsRecipient,
      [
        dealWithEther(editionInputs.salesConfig.priceEther),
        editionInputs.salesConfig.perWalletMintCap,
        editionInputs.salesConfig.publicSaleStart,
        editionInputs.salesConfig.publicSaleEnd,
        editionInputs.salesConfig.presaleStart,
        editionInputs.salesConfig.presaleEnd,
        editionInputs.salesConfig.presaleMerkleRoot
      ],
      FlexibleEditionMetadataRenderer_ADDRESS_RINKEBY,
      utils.defaultAbiCoder.encode(
        [
          "string", 
          "string", 
          "string"
        ],
        [
          editionInputs.songMetadataURI,
          editionInputs.metadataAnimationURI,
          editionInputs.metadataImageURI
        ]
      )
    ],
    onError(rinkebyError) {
      console.log("rinkeby error", rinkebyError)
    },
  })

  const { write: rinkebyWrite } = useContractWrite(rinkebyConfig)

  // const { data: rinkebyEditionData, isError: rinkebyEditionError, isLoading: rinkebyEditionLoading, write: rinkebyWrite } = useContractWrite({
  //   mode: 'recklesslyUnprepared',
  //   addressOrName: ZoraNFTCreatorProxy_ADDRESS_RINKEBY,
  //   contractInterface: ZoraNFTCreatorV1_ABI.abi,
  //   functionName: 'setupDropsContract',
  //   args: [
  //     editionInputs.contractName,
  //     editionInputs.contractSymbol,
  //     editionInputs.contractAdmin,
  //     editionInputs.contractMaxSupply,
  //     editionInputs.secondaryRoyalties,
  //     editionInputs.fundsRecipient,
  //     [
  //       dealWithEther(editionInputs.salesConfig.priceEther),
  //       editionInputs.salesConfig.perWalletMintCap,
  //       editionInputs.salesConfig.publicSaleStart,
  //       editionInputs.salesConfig.publicSaleEnd,
  //       editionInputs.salesConfig.presaleStart,
  //       editionInputs.salesConfig.presaleEnd,
  //       editionInputs.salesConfig.presaleMerkleRoot
  //     ],
  //     FlexibleEditionMetadataRenderer_ADDRESS_RINKEBY,
  //     utils.defaultAbiCoder.encode(
  //       [
  //         "string", 
  //         "string", 
  //         "string"
  //       ],
  //       [
  //         editionInputs.songMetadataURI,
  //         editionInputs.metadataAnimationURI,
  //         editionInputs.metadataImageURI
  //       ]
  //     )
  //   ]
  // })  

  // new calls - mainnet

  const { config: mainnetConfig, error: mainnetError } = usePrepareContractWrite({
    addressOrName: ZoraNFTCreatorProxy_ADDRESS_MAINNET,
    contractInterface: ZoraNFTCreatorV1_ABI.abi,
    functionName: 'setupDropsContract',
    args: [
      editionInputs.contractName,
      editionInputs.contractSymbol,
      editionInputs.contractAdmin,
      editionInputs.contractMaxSupply,
      editionInputs.secondaryRoyalties,
      editionInputs.fundsRecipient,
      [
        dealWithEther(editionInputs.salesConfig.priceEther),
        editionInputs.salesConfig.perWalletMintCap,
        editionInputs.salesConfig.publicSaleStart,
        editionInputs.salesConfig.publicSaleEnd,
        editionInputs.salesConfig.presaleStart,
        editionInputs.salesConfig.presaleEnd,
        editionInputs.salesConfig.presaleMerkleRoot
      ],
      FlexibleEditionMetadataRenderer_ADDRESS_MAINNET,
      utils.defaultAbiCoder.encode(
        [
          "string",
          "string",
          "string"
        ],
        [
          editionInputs.songMetadataURI,
          editionInputs.metadataAnimationURI,
          editionInputs.metadataImageURI
        ]
      )
    ]
  })

  const { write: mainnetWrite } = useContractWrite(mainnetConfig)  

  useEffect(() => {
    if(!chain) {
      console.log("no wallet connected")
    } else {
      console.log("chain ID =", chain.id)
    }},
    [chain]
  )


  return (
    <div className="mt-2 sm:0 min-h-screen h-screen">
      <Header />
      <main className=" text-white h-full flex sm:flex-col flex-row flex-wrap">

        <div className=" sm:w-6/12 sm:h-full w-full h-6/12 flex flex-row flex-wrap content-start">
          <div className="mt-20 sm:mt-10 flex flex-row justify-center h-fit w-full border-2 border-solid border-red-500 ">
            CONTRACT INPUTS
          </div>
          
          
          
          <div className="flex flex-row justify-center w-full h-fit border-2 border-white border-solid">
            <div className="flex flex-row w-full justify-center grid grid-cols-3">
              <div className="text-center ">
                CONTRACT NAME
              </div>
              <input
                className="text-black text-center bg-slate-200"
                placeholder="Input NFT Address"
                name="inputContract"
                type="text"
                value={editionInputs.contractName}
                onChange={(e) => {
                    e.preventDefault();
                    setEditionInputs(current => {
                      return {
                        ...current,
                        contractName: e.target.value
                      }
                    })
                }}
                required                    
              >
              </input>
              <button>
                HOVER FOR INFO
              </button>
            </div>            
          </div>

          <div className="flex flex-row justify-center w-full h-fit border-2 border-white border-solid">
            <div className="flex flex-row w-full justify-center grid grid-cols-3">
              <div className="text-center">
                CONTRACT SYMBOL
              </div>
              <input
                className="text-black text-center bg-slate-200"
                placeholder="Input NFT Address"
                name="inputContract"
                type="text"
                value={editionInputs.contractSymbol}
                onChange={(e) => {
                    e.preventDefault();
                    setEditionInputs(current => {
                      return {
                        ...current,
                        contractSymbol: e.target.value
                      }
                    })
                }}
                required                    
              >
              </input>
              <button>
                HOVER FOR INFO
              </button>
            </div>            
          </div>

          <div className="flex flex-row justify-center w-full h-fit border-2 border-white border-solid">
            <div className="flex flex-row w-full justify-center grid grid-cols-3">
              <div className="text-center">
                CONTRACT MAX SUPPLY
              </div>
              <input
                className="text-black text-center bg-slate-200"
                placeholder="Input NFT Address"
                name="inputContract"
                type="number"
                value={editionInputs.contractMaxSupply}
                onChange={(e) => {
                    e.preventDefault();
                    setEditionInputs(current => {
                      return {
                        ...current,
                        contractMaxSupply: e.target.value
                      }
                    })
                }}
                required                    
              >
              </input>
              <button>
                HOVER FOR INFO
              </button>
            </div>            
          </div>                

          <div className="flex flex-row justify-center w-full h-fit border-2 border-white border-solid">
            <div className="flex flex-row w-full justify-center grid grid-cols-3">
              <div className="text-center">
                SECONDARY ROYALTIES
              </div>
              <input
                className="text-black text-center bg-slate-200"
                placeholder="Input NFT Address"
                name="inputContract"
                type="number"
                value={editionInputs.secondaryRoyalties}
                onChange={(e) => {
                    e.preventDefault();
                    setEditionInputs(current => {
                      return {
                        ...current,
                        secondaryRoyalties: e.target.value
                      }
                    })
                }}
                required                    
              >
              </input>
              <button>
                HOVER FOR INFO
              </button>
            </div>            
          </div>

          <div className="flex flex-row justify-center w-full h-fit border-2 border-white border-solid">
            <div className="flex flex-row w-full justify-center grid grid-cols-3">
              <div className="text-center">
                FUNDS RECIPIENT
              </div>
              <input
                className="text-black text-center bg-slate-200"
                placeholder="Input NFT Address"
                name="inputContract"
                type="text"
                value={editionInputs.fundsRecipient}
                onChange={(e) => {
                    e.preventDefault();
                    setEditionInputs(current => {
                      return {
                        ...current,
                        fundsRecipient: e.target.value
                      }
                    })
                }}
                required                    
              >
              </input>
              <button>
                HOVER FOR INFO
              </button>
            </div>            
          </div>

          <div className="flex flex-row justify-center w-full h-fit border-2 border-white border-solid">
            <div className="flex flex-row w-full justify-center grid grid-cols-3">
              <div className="text-center">
                CONTRACT ADMIN
              </div>
              <input
                className="text-black text-center bg-slate-200"
                placeholder="Input NFT Address"
                name="inputContract"
                type="text"
                value={editionInputs.contractAdmin}
                onChange={(e) => {
                    e.preventDefault();
                    setEditionInputs(current => {
                      return {
                        ...current,
                        contractAdmin: e.target.value
                      }
                    })
                }}
                required                    
              >
              </input>
              <button>
                HOVER FOR INFO
              </button>
            </div>            
          </div>          

          <div className="flex flex-row justify-center w-full h-fit border-2 border-white border-solid">
            <div className="flex flex-row w-full justify-center grid grid-cols-3">
              <div className="text-center">
                PRICE PER MINT
              </div>
              <input
                className="text-black text-center bg-slate-200"
                placeholder="Input NFT Address"
                name="inputContract"
                type="number"
                value={editionInputs.salesConfig.priceEther}
                onChange={(e) => {
                    e.preventDefault();
                    setEditionInputs(current => {
                      return {
                        ...current,
                        salesConfig: {
                          ...current.salesConfig,
                          priceEther: e.target.value
                        }                        
                      }
                    })
                }}
                required                    
              >
              </input>
              <button>
                HOVER FOR INFO
              </button>
            </div>            
          </div>

          <div className="flex flex-row justify-center w-full h-fit border-2 border-white border-solid">
            <div className="flex flex-row w-full justify-center grid grid-cols-3">
              <div className="text-center">
                MINT CAP PER WALLET
              </div>
              <input
                className="text-black text-center bg-slate-200"
                placeholder="Input NFT Address"
                name="inputContract"
                type="number"
                value={editionInputs.salesConfig.perWalletMintCap}
                onChange={(e) => {
                    e.preventDefault();
                    setEditionInputs(current => {
                      return {
                        ...current,
                        salesConfig: {
                          ...current.salesConfig,
                          perWalletMintCap: e.target.value
                        }                        
                      }
                    })
                }}
                required                    
              >
              </input>
              <button>
                HOVER FOR INFO
              </button>
            </div>            
          </div>

          <div className="flex flex-row justify-center w-full h-fit border-2 border-white border-solid">
            <div className="flex flex-row w-full justify-center grid grid-cols-3">
              <div className="text-center">
                PUBLIC SALE START
              </div>
              <input
                className="text-black text-center bg-slate-200"
                placeholder="Input NFT Address"
                name="inputContract"
                type="number"
                value={editionInputs.salesConfig.publicSaleStart}
                onChange={(e) => {
                    e.preventDefault();
                    setEditionInputs(current => {
                      return {
                        ...current,
                        salesConfig: {
                          ...current.salesConfig,
                          publicSaleStart: e.target.value
                        }                        
                      }
                    })
                }}
                required                    
              >
              </input>
              <button>
                HOVER FOR INFO
              </button>
            </div>            
          </div>

          <div className="flex flex-row justify-center w-full h-fit border-2 border-white border-solid">
            <div className="flex flex-row w-full justify-center grid grid-cols-3">
              <div className="text-center">
                PUBLIC SALE END
              </div>
              <input
                className="text-black text-center bg-slate-200"
                placeholder="Input NFT Address"
                name="inputContract"
                type="number"
                value={editionInputs.salesConfig.publicSaleEnd}
                onChange={(e) => {
                    e.preventDefault();
                    setEditionInputs(current => {
                      return {
                        ...current,
                        salesConfig: {
                          ...current.salesConfig,
                          publicSaleEnd: e.target.value
                        }                        
                      }
                    })
                }}
                required                    
              >
              </input>
              <button>
                HOVER FOR INFO
              </button>
            </div>            
          </div>

          <div className="flex flex-row justify-center w-full h-fit border-2 border-white border-solid">
            <div className="flex flex-row w-full justify-center grid grid-cols-3">
              <div className="text-center">
                PRESALE START
              </div>
              <input
                className="text-black text-center bg-slate-200"
                placeholder="Input NFT Address"
                name="inputContract"
                type="number"
                value={editionInputs.salesConfig.presaleStart}
                onChange={(e) => {
                    e.preventDefault();
                    setEditionInputs(current => {
                      return {
                        ...current,
                        salesConfig: {
                          ...current.salesConfig,
                          presaleStart: e.target.value
                        }                        
                      }
                    })
                }}
                required                    
              >
              </input>
              <button>
                HOVER FOR INFO
              </button>
            </div>            
          </div>                 

          <div className="flex flex-row justify-center w-full h-fit border-2 border-white border-solid">
            <div className="flex flex-row w-full justify-center grid grid-cols-3">
              <div className="text-center">
                PRESALE END
              </div>
              <input
                className="text-black text-center bg-slate-200"
                placeholder="Input NFT Address"
                name="inputContract"
                type="number"
                value={editionInputs.salesConfig.presaleEnd}
                onChange={(e) => {
                    e.preventDefault();
                    setEditionInputs(current => {
                      return {
                        ...current,
                        salesConfig: {
                          ...current.salesConfig,
                          presaleEnd: e.target.value
                        }                        
                      }
                    })
                }}
                required                    
              >
              </input>
              <button>
                HOVER FOR INFO
              </button>
            </div>            
          </div>

          {/* <div className="flex flex-row justify-center w-full h-fit border-2 border-white border-solid">
            <div className="flex flex-row w-full justify-center grid grid-cols-3">
              <div className="text-center">
                PRESALE MERKLE ROOT
              </div>
              <input
                className="text-black text-center bg-slate-200"
                placeholder="Input NFT Address"
                name="inputContract"
                type="text"
                value={editionInputs.salesConfig.presaleMerkleRoot}
                onChange={(e) => {
                    e.preventDefault();
                    setEditionInputs(current => {
                      return {
                        ...current,
                        salesConfig: {
                          ...current.salesConfig,
                          presaleMerkleRoot: e.target.value
                        }                        
                      }
                    })
                }}
                required                    
              >
              </input>
              <button>
                HOVER FOR INFO
              </button>
            </div>            
          </div>                                                                                                                      */}

          {/* <div className="flex flex-row justify-center w-full h-fit border-2 border-white border-solid">
            <div className="flex flex-row w-full justify-center grid grid-cols-3">
              <div className="text-center">
                EDITION DESCRIPTION
              </div>
              <input
                className="text-black text-center bg-slate-200"
                placeholder="Input NFT Address"
                name="inputContract"
                type="text"
                value={editionInputs.editionDescription}
                onChange={(e) => {
                    e.preventDefault();
                    setEditionInputs(current => {
                      return {
                        ...current,
                        editionDescription: e.target.value
                      }
                    })
                }}
                required                    
              >
              </input>
              <button>
                HOVER FOR INFO
              </button>
            </div>            
          </div>

          <div className="flex flex-row justify-center w-full h-fit border-2 border-white border-solid">
            <div className="flex flex-row w-full justify-center grid grid-cols-3">
              <div className="text-center">
                ANIMATION URI
              </div>
              <input
                className="text-black text-center bg-slate-200"
                placeholder="Input NFT Address"
                name="inputContract"
                type="text"
                value={editionInputs.metadataAnimationURI}
                onChange={(e) => {
                    e.preventDefault();
                    setEditionInputs(current => {
                      return {
                        ...current,
                        metadataAnimationURI: e.target.value
                      }
                    })
                }}
                required                    
              >
              </input>
              <button>
                HOVER FOR INFO
              </button>
            </div>            
          </div>

          <div className="flex flex-row justify-center w-full h-fit border-2 border-white border-solid">
            <div className="flex flex-row w-full justify-center grid grid-cols-3">
              <div className="text-center">
                IMAGE URI
              </div>
              <input
                className="text-black text-center bg-slate-200"
                placeholder="Input NFT Address"
                name="inputContract"
                type="text"
                value={editionInputs.metadataImageURI}
                onChange={(e) => {
                    e.preventDefault();
                    setEditionInputs(current => {
                      return {
                        ...current,
                        metadataImageURI: e.target.value
                      }
                    })
                }}
                required                    
              >
              </input>
              <button>
                HOVER FOR INFO
              </button>
            </div>            
          </div> */}
                            
          <div className="flex flex-row justify-center w-full h-fit border-2 border-red-500 border-solid">
            <div
              className="border-2  border-solid border-red-500 py-1 flex flex-row w-full justify-center"

            >
              METADATA INPUTS + UPLOAD
            </div>            
          </div>          
          <div className="flex flex-row justify-center w-full h-fit border-2 border-white border-solid">
            <div className="h-20 flex flex-row w-full justify-center items-center grid grid-cols-2">
              <button 
                onClick={() => setSongForm(true)}
                className="h-full justify-center text-center border-2 hover:bg-white hover:text-black"
              >
                OPEN FORM
              </button>
              <div className="h-full grid grid-row-2 ">
                <div
                className=" flex flex-row justify-center items-end  underline underline-offset-4 border-l-2 border-r-2 border-t-2 "
                >
                  METADATA STATUS
                </div>
                <div
                className="flex flex-row justify-center items-start text-center border-l-2 border-r-2 border-b-2 "
                >
                  {/* {metadataStatus} */}
                </div>
              </div>
            </div>            
          </div>          
          <SongForm
            minting={minting}
            setSongForm={setSongForm}
            songForm={songForm}
            setMinting={setMinting}
            editionInputs={editionInputs}
            setEditionInputs={setEditionInputs}
            // setMetadataStatus={setMetadataStatus}
          />              
        </div>

        <div className=" sm:w-6/12 sm:h-full w-full h-6/12 flex flex-row flex-wrap content-start">
          <div className="mt-20 sm:mt-10 flex flex-row justify-center h-fit w-full border-2 border-solid border-blue-500 ">
            PREVIEW + DEPLOY
          </div>
          <div className="border-2 border-white border-solid w-full flex flex-row flex-wrap justify-center">
            <div className="mt-2 w-full flex flex-row justify-center">
              { editionInputs.metadataImageURI === "imageURI/" ? (
              <Image
                src={`/placeholder_400_400.png`}
                width={400}
                height={400}
              />
              ) : (
              <Image
                src={`https://ipfs.io/ipfs/${getCID(editionInputs.metadataImageURI)}`}
                width={400}
                height={400}
              />
              )}
            </div>            
            <audio
              className="my-2"
              controls
              src={`https://ipfs.io/ipfs/${getCID(editionInputs.metadataAnimationURI)}`}
            />
            <div>
              
            </div>
          </div>        
          <div className="flex flex-row justify-center w-full h-fit border-2 border-blue-500 border-solid">
          <button
              disabled={false}
              className="border-2 hover:bg-white hover:text-black border-solid border-blue-500 py-1 flex flex-row w-full justify-center"
              onClick={() => createEditionRinkeby()}
            >
              DEPLOY TO RINKEBY
            </button>            
            {/* { metadataStatus === "Metadata Uploaded Successfully" ? (
            <button
              disabled={!rinkebyWrite}
              className="border-2 hover:bg-white hover:text-black border-solid border-blue-500 py-1 flex flex-row w-full justify-center"
              onClick={() => createEditionRinkeby()}
            >
              DEPLOY TO RINKEBY
            </button>
            ) : (
              <button
              disabled={true}
              className="border-2 text-slate-800 border-solid border-blue-500 py-1 flex flex-row w-full justify-center"
              onClick={() => createEditionRinkeby()}
            >
              DEPLOY TO RINKEBY
            </button>
            )} */}
            <button
              disabled={true}
              className="border-2 border-l-0 border-solid border-blue-500 py-1 text-slate-700 flex flex-row w-full justify-center"
              // className="border-2 border-l-0 hover:bg-white hover:text-black border-solid border-blue-500 py-1  flex flex-row w-full justify-center"
              onClick={() => createEditionMainnet()}
            >
              DEPLOY TO MAINNET
            </button>              
          </div>                                                                                                       
        </div>
      </main>
    </div>
  )
}

export default Create
