// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/// @title CurationSeason
/// @notice Explain to an end user what this does
contract CurationSeason is Ownable {
    /* ===== ERRORS ===== */
    /// @notice invalid curation pass
    error Access_MissingPass();

    /// @notice
    error Access_Unauthorized();

    /// @notice season is inactive
    error Inactive();

    /// @notice duplicate listing
    error ListingAlreadyExists();

    /* ===== EVENTS ===== */
    event ListingAdded(address indexed curator, address indexed listingAddress);

    event ListingRemoved(
        address indexed curator,
        address indexed listingAddress
    );

    event TitleUpdated(address indexed sender, string title);

    event CurationPassUpdated(address indexed sender, address curationPass);

    event SeasonFinalized(address sender);

    /* ===== VARIABLES ===== */

    address[] public listings;
    mapping(address => address) public listingCurators;

    string public title;
    IERC721 public curationPass;
    bool public isActive = true;

    /* ===== MODIFIERS ===== */

    modifier onlyOwnerOrCurator() {
        if (
            owner() != _msgSender() && curationPass.balanceOf(_msgSender()) == 0
        ) {
            revert Access_MissingPass();
        }

        _;
    }

    // checks if curation functionality is active
    modifier onlyIfActive() {
        if (isActive == false) {
            revert Inactive();
        }

        _;
    }

    /* ===== CONSTRUCTOR ===== */

    constructor(string memory _title, IERC721 _curationPass) {
        title = _title;
        curationPass = _curationPass;
    }

    /* ===== CURATION FUNCTIONS ===== */

    /// @dev Explain to a developer any extra details
    /// @param listing parameter just like in doxygen (must be followed by parameter name)
    function addListing(address listing)
        external
        onlyIfActive
        onlyOwnerOrCurator
    {
        if (listingCurators[listing] != address(0)) {
            revert ListingAlreadyExists();
        }

        require(
            listing != address(0),
            "listing address cannot be the zero address"
        );

        listingCurators[listing] = _msgSender();

        listings.push(listing);

        emit ListingAdded(_msgSender(), listing);
    }

    /// @notice removes listing
    function removeListing(address listing)
        external
        onlyIfActive
        onlyOwnerOrCurator
    {
        if (
            owner() != _msgSender() && listingCurators[listing] != _msgSender()
        ) {
            revert Access_Unauthorized();
        }

        delete listingCurators[listing];
        removeByValue(listing);

        emit ListingRemoved(_msgSender(), listing);
    }

    /* ===== OWNER FUNCTIONS ===== */

    function updateTitle(string memory _title) public onlyOwner {
        title = _title;

        emit TitleUpdated(_msgSender(), _title);
    }

    function updateCurationPass(IERC721 _curationPass) public onlyOwner {
        curationPass = _curationPass;

        emit CurationPassUpdated(_msgSender(), address(_curationPass));
    }

    function finalizeSeason() public onlyOwner {
        isActive = false;

        emit SeasonFinalized(_msgSender());
    }

    /* ===== HELPERS ===== */
    function find(address value) internal view returns (uint256) {
        uint256 i = 0;
        while (listings[i] != value) {
            i++;
        }
        return i;
    }

    function removeByIndex(uint256 index) internal {
        if (index >= listings.length) return;

        for (uint256 i = index; i < listings.length - 1; i++) {
            listings[i] = listings[i + 1];
        }

        listings.pop();
    }

    function removeByValue(address value) internal {
        uint256 i = find(value);
        removeByIndex(i);
    }
}
