import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";


export const Header = () => {

  return (
    <div className="bg-[#0E0411] text-[#00c2ff] flex flex-row justify-center border-b-[1px] border-solid border-[#00c2ff] ">
      <div className="z-10 mr-4  sm:top-0 items-center h-fit  justify-between flex flex-row  w-full ">
        <div
            className="ml-5 flex-flex-row items-center"
          >
          <Image
              src={"/header_logo.png"}
              width={100}
              height={69}
            />
        </div>        
        <div className="flex flex-row items-center">
          <div className="mr-5 space-x-4">
            <Link
                href="/collect"
              >
                <a className="hover:text-[#7DE0FF]">
                  Collect
                </a>
            </Link>   
            <Link
              href="/curate"
            >
              <a className="hover:text-[#7DE0FF]">
                Curate
              </a>
            </Link>        
            <Link
              className="pr-5"
              href="/about"
            >
              <a className="hover:text-[#7DE0FF]">
                About
              </a>
            </Link>
          </div>
          <ConnectButton 
            accountStatus="address" 
            showBalance={false}
          />
        </div>
      </div>
    </div>
  )

};