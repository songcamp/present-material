import { useMemo } from "react"
import { useEnsName } from "wagmi"
import { shortenAddress } from "../utils/shortenAddress"

export function EditionArtist({
  creatorAddress
}: {
  /**
   * Expects wallet address of edition creator
   */
  creatorAddress?: string
}) {
  const { data: ensName } = useEnsName({
    address: creatorAddress
  })
  
  /** 
   * @0xTranqui :: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
   * Memoize if using async data
   * */

  const creator = useMemo(() => ensName ?? shortenAddress(creatorAddress), [ensName])

  return (
    <div className="ml-3 flex flex-row w-full font-bold text-xl">
      {"ARTIST - "}
      <a
        className="pl-2 hover:underline decoration-1"
        href={"https://etherscan.io/address/" + creatorAddress}
        target="_blank"
        rel="noreferrer"
      >
        {creator}
      </a> 
    </div>
  )
}
