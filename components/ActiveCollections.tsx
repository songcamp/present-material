import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
import { Networks, Strategies } from "@zoralabs/nft-hooks"
import { useAccount, useContractRead, useContractWrite, useEnsName } from 'wagmi'
import { Header } from '../components/Header'
import UserNFTs from '../components/UserNFTs';
import Link from 'next/link';
import Image from 'next/image';
import * as presentMaterialsCurator from "../contractABI/presentMaterialsCurator.json"


const shortenAddress = (address) => {
    const shortenedAddress = address.slice(0, 4) + "..." + address.slice(address.length - 4)
    return shortenedAddress
}

export const GetSpecificCurator = ({ collectionToCheck, index }) => {


    console.log("what is index getting passed in: ", index)
    console.log("what is getting passed in : ", collectionToCheck)

    const { data, isError, isLoading, isSuccess, isFetching  } = useContractRead({
        addressOrName: "0xE5D36DF3087C19f108BBA4bb0D79143b8b4725Bb", // PresentMaterialsCurator https://rinkeby.etherscan.io/address/0xe5d36df3087c19f108bba4bb0d79143b8b4725bb#writeContract
        contractInterface: presentMaterialsCurator.abi,
        functionName: 'viewCuratorByCollection',
        args: [
            collectionToCheck
        ],
        watch: false,
        onError(error) {
            console.log("error: ", isError)
        },
        onSuccess(data) {
            console.log("Array of current collections --> ", data)
        }  
    })        

    const { data: ensData, isError: ensError, isLoading: ensLoading, isSuccess: ensSuccess, isFetching: ensIsFetching  } = useEnsName({
        address: data[0], 
    })        

    const ensToRender = ensData && ensData != undefined 
        ? ensData 
        : shortenAddress(data[0])


    return (
        <>
            {!!collectionToCheck  ? ( 
            <div className="">
                {(index + 1) + ". " + shortenAddress(collectionToCheck) + " | " + "Curated by: " + ensToRender}
            </div>                  
            ) : (
                <div>
                collection loading ...
                </div>
            )}
        </>
    )
}
