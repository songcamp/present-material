import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

const sortOptions = [
    { name: '1', queryValue: '1' },
    { name: '2', queryValue: '2' },
    { name: '3', queryValue: '3' },
    { name: '4', queryValue: '4' },
    { name: '5', queryValue: '5' }
]

export default function MintQuantityV2({ colorScheme, mintQuantityCB }) {
    const [mintQuantity, setMintQuantity] = useState({ name: '1', queryValue: '1' })

    const select = (arg) => {
        setMintQuantity(arg);
        mintQuantityCB(arg)
    }

    return (
        <div className={`text-[#00C2FF]  z-9 flex col-start-1 col-end-2  w-full flex-row justify-self-end`}>
            <Listbox value={mintQuantity} onChange={select}>
            <div className="w-full">

                { colorScheme === "#c23d05" ? (
                <Listbox.Button className={`border-[#00C2FF] hover:bg-[#7DE0FF]  focus-visible:ring-offset-[${colorScheme}]
                w-full h-full hover:text-black cursor-pointer relative border-solid  border-[1px] border-[#00C2FF] bg-transparent py-2 pl-3 pr-10 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2FF]  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-xl`}
                >
                
                
                <span className="block truncate">{mintQuantity.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <SelectorIcon
                        className="h-5 w-5"
                        aria-hidden="true" 
                    />
                </span>
                </Listbox.Button>
                ) : (
                <Listbox.Button className={`border-[#00C2FF] hover:bg-[#7DE0FF]  focus-visible:ring-offset-[${colorScheme}]
                w-full h-full hover:text-black cursor-pointer relative border-solid  border-[1px] bg-transparent   text-center  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2FF]  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-xl`}
                >
                
                
                <span className="block truncate">{mintQuantity.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <SelectorIcon
                        className="h-5 w-5"
                        aria-hidden="true" 
                    />
                </span>
                </Listbox.Button>
                )}
                <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >

                    { colorScheme === "#c23d05" ? (
                    <Listbox.Options className="absolute z-[11] mt-1 max-h-60 w-full  overflow-auto  bg-black text-base  ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {sortOptions.map((option, optionIdx) => (
                        <Listbox.Option
                        key={optionIdx}
                        className={({ active }) =>
                            `cursor-pointer border-[1px] border-solid border-[#00C2FF]  relative select-none py-2 pl-4 pr-4 ${
                                active ? `bg-[#00C2FF]  text-black ` : `text-[#00C2FF]  bg-[#00C2FF]  `
                            }`
                        }
                        value={option}
                        >
                        {({ selected }) => (
                            <>
                                <span
                                className={`block truncate ${
                                    selected ? 'font-medium' : 'font-normal'
                                }`}
                                >
                                {option.name}
                                </span>
                                {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                                    {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                                </span>
                                ) : null}
                            </>
                        )}
                        </Listbox.Option>
                        ))}
                    </Listbox.Options>
                    ) : (
                    <Listbox.Options className="absolute z-[11] mt-1 max-h-60 w-fit overflow-auto  bg-[#00C2FF]  text-base  ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {sortOptions.map((option, optionIdx) => (
                        <Listbox.Option
                        key={optionIdx}
                        className={({ active }) =>
                            `cursor-pointer border-[1px] border-solid border-[#00C2FF]  relative select-none py-2 pl-4 pr-4 ${
                                active ? `bg-[#7DE0FF]   text-black ` : `text-[#00C2FF]  bg-black `
                            }`
                        }
                        value={option}
                        >
                        {({ selected }) => (
                            <>
                                <span
                                className={`block truncate ${
                                    selected ? 'font-medium' : 'font-normal'
                                }`}
                                >
                                {option.name}
                                </span>
                                {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                                    {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                                </span>
                                ) : null}
                            </>
                        )}
                        </Listbox.Option>
                        ))}
                    </Listbox.Options>
                    )}
                </Transition>
            </div>
            </Listbox>
        </div>
    )
}