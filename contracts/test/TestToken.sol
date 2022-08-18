/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC721, Ownable {
    uint256 tokenId = 0;

    constructor() ERC721("TEST", "testing") {}

    function mint(address to) public onlyOwner {
        _mint(to, tokenId++);
    }
}
