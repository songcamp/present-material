/**
 * 
 * @param address 
 * @returns shortend Address ie: '0x10...e05c' or undefined if unvalid prop
 */

export const shortenAddress = (address?: string) => {
  try {
    return address.slice(0, 4) + "..." + address.slice(address.length - 4)
  } catch (err) {
    return undefined
  }
}