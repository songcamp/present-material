import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";


export const Header = () => {

  return (
    <div className="bg-black text-[#00c2ff] flex flex-row justify-center">
      <div className="z-[0] mr-4 bg-black fixed top-12 sm:top-0 items-center h-[7%]  flex flex-row justify-end w-full ">
        <div className="mr-5 space-x-4">
          <Link
              href="/collect"
            >
              <a className="hover:text-[#f53bc3]">
                COLLECT
              </a>
          </Link>   
          <Link
            href="/curate"
          >
            <a className="hover:text-[#f53bc3]">
              CURATE
            </a>
          </Link>        
          <Link
            className="pr-5"
            href="/about"
          >
            <a className="hover:text-[#f53bc3]">
              ABOUT
            </a>
          </Link>
        </div>
        <ConnectButton 
          accountStatus="address" 
          showBalance={false}
        />

      </div>
    </div>
  )

};