import type { NextPage } from 'next'
import Head from 'next/head'
import { useContractRead } from 'wagmi'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import * as CurationManager from "../contractABI/CurationManager.json"
import EditionCard from '../components/EditionCard';
import Image from 'next/image'

const Home: NextPage = () => {

  // CuratorContract Read Call --> query array of all active curators
  const { data, isError, isLoading, isSuccess, isFetching  } = useContractRead({
    addressOrName: "0x266e365b1DB9Ad2Ed153851Ad2EA890375A8fc3E", 
    contractInterface: CurationManager.abi,
    functionName: 'viewAllListings',
    watch: true,
    onError(error) {
        console.log("error: ", isError)
    },
    onSuccess(data) {
        console.log("Array of current collections --> ", data)
    }  
  })
  
  const collectionData = data ? data : []
  const rowAndColumnCount = collectionData.length

  return (
    
    <div className='flex flex-col justify-center items-center h-full min-h-screen scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-600' >
      <Header />
      <Head>
        <title>Present Material</title>
        <meta name="description" content="Songcamp: Present Material" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content="Present Material" />
        <meta
          property="og:image"
          content="https://present-materials.vercel.app/mobile_preview.png"
        />
        <meta name="twitter:card" content="summary_large_image"
        />
        <meta name="twitter:description" content="created by tranqui.eth"
        />

        <meta name="twitter:title" content="Finders Fee Finder"
        />

        <meta name="twitter:image" content="https://present-materials.vercel.app/16_9.svg"
        />           
        <link rel="icon" href="https://present-materials.vercel.app/mobile_preview.png" />
        <link rel="apple-touch-icon" href="https://present-materials.vercel.app/mobile_preview.png" />
      </Head>

      <div className="py-10 border-t-[1px] border-solid border-[#00c2ff] mt-[80px] w-full flex flex-row justify-center ">
        <Image
          src={"/collection_page_graphic_v2.png"}
          height={227}
          width={315}
        />
      </div>
      <main className={` pb-8 sm:pb-[70px] text-white grid grid-rows-[${rowAndColumnCount}]  flex justify-center lg:grid-cols-3 sm:grid-cols-2  w-[90%] sm:w-[80%]  gap-y-8 sm:gap-y-[70px]  gap-x-0 sm:gap-x-[70px]`}> 

      {
        collectionData.map((collection, index) => {
          while (index < collectionData.length) {
            return (
              <EditionCard editionAddress={collectionData[index]} />
            )
          }
        })
      }

      </main>
      <Footer />
    </div>
  )
}

export default Home
