
import { useContractRead, useEnsName } from 'wagmi'
import * as presentMaterialsCurator from "../contractABI/presentMaterialsCurator.json"
import * as presentMaterialsCuratorV2 from "../contractABI/presentMaterialsCuratorV2.json"

const shortenAddress = (address) => {
    if (!!address) {
        const shortenedAddress = address.slice(0, 4) + "..." + address.slice(address.length - 4)
        return shortenedAddress
    } else {
        return "loading ..."
    }
}

export const GetSpecificCurator = ({ collectionToCheck, index }) => {

    const { data: curatorData, isError, isLoading, isSuccess, isFetching  } = useContractRead({
        addressOrName: "0x0D0A1da8Ef7882d0f2705bC936fE19462Ea99c39", // PresentMaterialsCurator https://rinkeby.etherscan.io/address/0xe5d36df3087c19f108bba4bb0d79143b8b4725bb#writeContract
        contractInterface: presentMaterialsCuratorV2.abi,
        functionName: 'viewCuratorByCollection',
        args: [
            collectionToCheck
        ],
        watch: false,
        onError(error) {
            console.log("error: ", isError)
        },
        onSuccess(data) {
            console.log("Array of current collections --> ", curatorData)
        }  
    })


    const curatorFetchAddress = curatorData ? curatorData[0] : ""

    const { data: ensData, isError: ensError, isLoading: ensLoading, isSuccess: ensSuccess, isFetching: ensIsFetching, refetch } = useEnsName({
        address: curatorFetchAddress,
        enabled: false,
        suspense: true
    })        

    const ensToRender = ensData && ensData != undefined 
        ? ensData 
        : shortenAddress(curatorFetchAddress)

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
