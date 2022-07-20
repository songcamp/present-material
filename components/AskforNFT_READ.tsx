import { Header } from "./Header";
import { useContractRead, useAccount } from "wagmi";
import { AsksV1_1Interface } from "@zoralabs/v3/dist/typechain/AsksV1_1"
import * as asksAddresses from "@zoralabs/v3/dist/addresses/1.json"
import { abi } from "@zoralabs/v3/dist/artifacts/AsksV1_1.sol/AsksV1_1.json"
import { useState, useEffect } from "react";
import { ReadContractResult } from "@wagmi/core";
import { BigNumber, utils } from "ethers";

export const AskForNFT_READ = (nft) => {

    // checking prop
    console.log("what is nft", nft)
    
    // get account hook
    const { address, connector, isConnecting, isConnected, status} = useAccount(); 
    const currentUserAddress = address ? address : ""


    // AsksV1_1 askForNFT read call

    const { data, isLoading, isSuccess, isFetching  } = useContractRead({
        addressOrName: asksAddresses.AsksV1_1,
        contractInterface: abi,
        functionName: 'askForNFT',
        args: [
            "0x7e6663E45Ae5689b313e6498D22B041f4283c88A",
            "1"
            // nft.nft.nft.contractAddress,
            // nft.nft.nft.tokenId
        ],
        watch: true,
        onError(error) {
            console.log("error: ", error)
        },
        onSuccess(data) {
            console.log("success! --> ", data)
        }  
    })

    const currentReadData = data ? data : ""
    console.log("currentReadData", currentReadData)
    const currentReadPrice = data ? `${utils.formatEther(BigNumber.from(currentReadData[4]).toString())}` + " ETH" : "undefined"
    const currentFindersFee = data ? `${currentReadData[3] / 100 }` + " %" : "undefined"

    const listingCheck = (sellerAddress) => {
        console.log("selleraddress: ", sellerAddress)
        if (sellerAddress === "0x0000000000000000000000000000000000000000") {
            return (
                <div className="flex flex-row content-center ">
                No Active Listing for current address + token Id
                </div>
            )
        } else {
            return (
                <div className="flex flex-row flex-wrap w-fit space-y-1">
                    <div className="flex flex-row flex-wrap w-full">                    
                        {"Contract Address: " + nft.nft.nft.contractAddress}
                    </div>                
                    <div className="flex flex-row flex-wrap w-full">                    
                        {"Token Id: " + nft.nft.nft.tokenId}
                    </div>                
                    <div className="flex flex-row flex-wrap w-full">                    
                        {"Seller: " + currentReadData[0]}
                    </div>
                    <div className="flex flex-row flex-wrap w-full">                    
                        {"Funds Recipient: " + currentReadData[1]}
                    </div>
                    <div className="flex flex-row flex-wrap w-full">                    
                        {"Currency: " + currentReadData[2]}
                    </div>
                    <div className="flex flex-row flex-wrap w-full">                    
                        {"Finders Fee: " + currentFindersFee}
                    </div>
                    <div className="flex flex-row flex-wrap w-full">                    
                        {"Price: " + currentReadPrice}
                    </div>
                </div>
            )
        }
    }
    
    return (
        <div className=" text-white text-sm h-full flex flex-col flex-wrap items-center justify-center">
            <main className=" w-full flex flex-row flex-wrap">        
                {listingCheck(currentReadData[0])}
            </main>
        </div>
    )
}