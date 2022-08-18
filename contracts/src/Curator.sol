/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract PresentMaterialsCurator is Ownable, ReentrancyGuard {
    // ===== VARIABLES
    // initialize tokenGate
    address public tokenGateAddress;
    // dynamic array that returns all curators with active collections
    address[] public allCollections;
    // mapping that stores array of active collections for each curator
    mapping(address => address[]) public curators;
    // ===== MODIFIERS
    modifier tokenGateCheck() {
        require(
            IERC721(tokenGateAddress).balanceOf(msg.sender) > 0,
            "you do not own tokenGate NFT"
        );
        _;
    }

    // inititalizes initial tokenGate collection Address for PresentMaterialsCurator
    constructor(address _initialTokenGateAddress) {
        tokenGateAddress = _initialTokenGateAddress;
    }

    // ===== TOKEN GATE RELATED FUNCTIONS
    function setTokenGateAddress(address _newTokenGateAddress)
        external
        onlyOwner
    {
        // make this ownable
        tokenGateAddress = _newTokenGateAddress;
    }

    function viewTokenGateAddress() public view returns (address) {
        return tokenGateAddress;
    }

    /// @notice view function that checks a user's balance of tokengate contract
    function viewUserBalanceOfTokenGate(address _address)
        public
        view
        returns (uint256)
    {
        return IERC721(tokenGateAddress).balanceOf(_address);
    }

    // ===== CURATION RELATED FUNCTIONS
    /// @notice view function that returns array of all active collections
    function viewAllCollections() public view returns (address[] memory) {
        return allCollections;
    }

    /// @notice view function that returns the curator of a given collection
    function viewCuratorByCollection(address _collection)
        public
        view
        returns (address[] memory)
    {
        // returns empty array if no active collection for a given curator
        return curators[_collection];
    }

    // adds collection to array of all active collections + adds curator to mapping of curators
    function addCurator(address _collection, address _newCurator)
        public
        tokenGateCheck
    {
        if (curators[_collection].length == 0) {
            allCollections.push(_collection);
        }
        // Update the value at this address
        curators[_collection].push(_newCurator);
    }

    /// @notice removes collection from array of all active collections + removes curator to mapping of curators if they
    //          have no more remaining active collecitons
    function removeCurator(address _collection, address _curatorToRemove)
        public
        tokenGateCheck
    {
        // TODO(max): Check user is removing only their own collection

        // Move the last element into the place to delete
        for (uint256 i = 0; i < curators[_collection].length; i++) {
            if (curators[_collection][i] == _curatorToRemove) {
                curators[_collection][i] = curators[_collection][
                    curators[_collection].length - 1
                ];
                // Remove the last element
                curators[_collection].pop();
                if (curators[_collection].length == 0) {
                    removeCollection(_collection);
                }
            }
        }
    }

    function removeCollection(address _collection) internal {
        for (uint256 j = 0; j < allCollections.length; j++) {
            if (allCollections[j] == _collection) {
                allCollections[j] = allCollections[allCollections.length - 1];
                allCollections.pop();
            }
        }
    }
}
