import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useState } from "react";
import ImageUploader from "./ImageUploader";
import AudioUploader from "./AudioUploader";
import { NFTStorage, File, } from "nft.storage";  

const nftStorageAPIKey = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY
const client = new NFTStorage({ token: nftStorageAPIKey })

export default function SongForm({
    minting,
    songForm,
    setSongForm,
    setMinting,
    editionInputs,
    setEditionInputs,
    // setMetadataStatus
}) {

    // TRACK STATE
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [audio, setAudio] = useState(null);


    const [audioCID, setAudioCID] = useState("")
    const [imageCID, setImageCID] = useState("")
    const [descriptionCID, setDescriptionCID] = useState("")
    const [ipfsLoading, setIpfsLoading] = useState(false)
    const [uploadSuccess, setUploadSuccess] = useState("No Files Uploaded")
    const [uploadAttempted, setUploadAttempted] = useState(false)

    const [track, setTrack] = useState({
        title: "",
        artist: "",
        duration: "",
        description: "",
        image: "",
        animation_uri: "",
    });    

    const closeModal = () => {
        setSongForm(false);
    }

    // ===== IPFS Audio Upload
    const ipfsAudioUpload = async () => {
        console.log("audio in upload", audio)
        const cid = await client.storeBlob(
            audio
        )
        console.log("audio cid: ", cid)
        setAudioCID(cid)
        setTrack(current => {
            return {
                ...current,
                animation_uri: `ipfs://${cid}`
            }
        })
        setEditionInputs(current => {
            return {
                ...current,
                metadataAnimationURI: `ipfs://${cid}`
            }
        })       
        return cid
    }    

    // ===== IPFS Image Upload
    const ipfsImageUpload = async () => {
        console.log("image in upload", image)
        const cid = await client.storeBlob(
            image
        )
        console.log("image cid: ", cid)
        setImageCID(cid)
        setTrack(current => {
            return {
                ...current,
                image: `ipfs://${cid}`
            }
        })
        setEditionInputs(current => {
            return {
                ...current,
                metadataImageURI: `ipfs://${cid}`
            }
        })                    
        return cid
    }
    
    // ===== IPFS Description Upload
    const ipfsDescriptionUpload = async (audioo, imagee) => {
        console.log("description before upload: ", track)
        // const metadata = JSON.stringify(track)
        const metadata = JSON.stringify({
            title: track.title,
            artist: track.artist,
            duration: track.duration,
            description: track.description,
            image: `ipfs://${imagee}`,
            animation_uri: `ipfs://${audioo}`,
        })
        console.log("what is the metadatta:", metadata)
        const metadataBlob = new Blob(
            [metadata],
            {type: 'application/json' }

        )
        const cid = await client.storeBlob(
            metadataBlob
        )
        console.log("description cid: ", cid)
        setDescriptionCID(cid)
        setTrack(current => {
            return {
                ...current,
                description: `ipfs://${cid}`
            }
        })
        setEditionInputs(current => {
            return {
                ...current,
                songMetadataURI: `ipfs://${cid}`
            }
        })    
        return cid     
    }        

    // ===== Combined Upload
    const ipfsCombinedUpload = async () => {
        setIpfsLoading(true)
        setUploadAttempted(true)
        setMetadataStatus("Loading . . .")
        const audioUpload = await ipfsAudioUpload()
        console.log("audioUpload: ", audioUpload)
        const imageUpload = await ipfsImageUpload()
        console.log("imageUpload: ", imageUpload)
        ipfsDescriptionUpload(audioUpload, imageUpload)


        // try {
        //     await ipfsAudioUpload()
        // } catch (error) {
        //     setUploadSuccess("error uploading audio")
        //     console.error(error)
        // } try {
        //     await ipfsImageUpload()
        // } catch (error) {
        //     setUploadSuccess("error uploading image")
        //     console.error(error)
        // } try {           
        //     await ipfsDescriptionUpload()
        // } catch (error) {
        //     setUploadSuccess("error uploading description") 
        //     console.error(error)
        // }
        setIpfsLoading(false)
        console.log("uploading loop exited")
        setUploadSuccess("Metadata Uploaded Successfully")
        setMetadataStatus("Metadata Uploaded Successfully")

    }                        


    return (
        <>
            <Transition appear show={songForm} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                    >
                    <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden  bg-stone-100 p-6 text-left align-middle shadow-xl transition-all">
                        <div className="md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <div className="px-4 sm:px-0">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                Image/Audio Preview
                            </h3>
                            </div>
                            {previewUrl && (
                            <div className="mt-4  border border-stone-500 rounded-lg overflow-hidden">
                                <Image
                                src={previewUrl}
                                alt="preview url for track"
                                layout="responsive"
                                objectFit="cover"
                                width={500}
                                height={500}
                                />
                            </div>
                            )}
                            {audio && (
                            <audio controls className="mt-4">
                                <source src={URL.createObjectURL(audio)} />
                            </audio>
                            )}
                        </div>
                        <div className="mt-5 md:mt-0 md:col-span-2">
                            <div className="shadow sm:rounded-md sm:overflow-hidden">
                                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-3 sm:col-span-2">
                                    <label
                                        htmlFor="artist"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Artist Name
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="artist"
                                            id="artist"
                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                            placeholder="Artist Name"
                                            defaultValue={""}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                setTrack(current => {
                                                    return {
                                                        ...current,
                                                        artist: e.target.value
                                                    }
                                                })
                                            }}
                                        />
                                    </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-3 sm:col-span-2">
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Track Name
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                            placeholder="Track Name"
                                            defaultValue={""}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                setTrack(current => {
                                                    return {
                                                        ...current,
                                                        title: e.target.value
                                                    }
                                                })
                                            }}
                                        />
                                    </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-3 sm:col-span-2">
                                    <label
                                        htmlFor="duration"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Track duration
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <input
                                        type="text"
                                        name="duration"
                                        id="duration"
                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        placeholder="03:45"
                                        defaultValue={""}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            setTrack(current => {
                                                return {
                                                    ...current,
                                                    duration: e.target.value
                                                }
                                            })
                                        }}
                                        />
                                    </div>
                                    </div>
                                </div>

                                <div>
                                    <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700"
                                    >
                                    Description (something you want to add in
                                    reference to the track)
                                    </label>
                                    <div className="mt-1">
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        maxLength={300}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                        placeholder="this song is awesome"
                                        defaultValue={""}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            setTrack(current => {
                                                return {
                                                    ...current,
                                                    description: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                    300 characters max
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                    Track cover photo
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-{dashed rounded-md">
                                    <ImageUploader
                                        image={image}
                                        setImage={setImage}
                                        previewUrl={previewUrl}
                                        setPreviewUrl={setPreviewUrl}
                                    />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                    Audio File
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <AudioUploader
                                        setAudio={setAudio}
                                        audio={audio}
                                        
                                    />
                                    {/* <div className="space-y-1 text-center">
                                        <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                        >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="audioFile"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                            id="audioFile"
                                            name="audioFile"
                                            type="file"
                                            className="sr-only"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                        WAV, MP3, MP4
                                        </p>
                                    </div> */}
                                    </div>
                                </div>
                                <div>
                                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">                                
                                        <button
                                            type="submit"
                                            onClick={() => ipfsCombinedUpload()}
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            UPLOAD TO IPFS
                                        </button>
                                        <button
                                            type="submit"
                                            onClick={() => closeModal()}
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            CLOSE
                                        </button>                                    
                                    </div>
                                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">                                
                                        {"Upload Status: "} 
                                        { !uploadAttempted ? 
                                        "no files uploaded" : 
                                        <>
                                        { ipfsLoading ?
                                        "loading . . ." : 
                                        uploadSuccess
                                        }
                                        </>
                                        }
                                    </div>                                                                                                          
                                </div>                                
                            </div>
                            </div>                            
                        </div>
                        </div>
                    </Dialog.Panel>
                    </Transition.Child>
                </div>
                </div>
            </Dialog>
            </Transition>
        </>
    );        

}