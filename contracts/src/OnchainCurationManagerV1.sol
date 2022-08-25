// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/// @notice Onchain Curation Manager V1
contract OnchainCurationManagerV1 is Ownable, ReentrancyGuard {
    /* ===== VARIABLES ===== */

    // initialize curation entity
    string public curationEntity;

    // initialize curation season #
    uint256 public curationSeason;

    /// define struct containing season details
    struct SeasonDetails {
        string title;
        address curationPassAddress;
        uint256 curationLimit;
        bool pauseState;
    }

    // initialize seasonDetails struct
    SeasonDetails public seasonDetails;

    // dynamic array that returns all listings currently being curated
    address[] public currentSeasonListings;

    // mapping that stores address of curator for each curated listing in each curation season
    // uint256 season => address listing => address curator
    mapping(uint256 => mapping(address => address))
        public curationSeasonDashboard;

    // mapping that stores encoded array of prior seasons's final curation lists
    mapping(uint256 => bytes) public curationSeasonArchive;

    /* ===== EVENTS ===== */
    // /// @notice Emitted when a season is finalized
    // event SeasonFinalized(
    //     uint256 indexed curationSeason,
    //     address indexed finalCurationPassAddress,
    //     uint256 indexed finalCurationLimit,
    //     uint256 finalCurationListLength
    // );

    /* ===== MODIFIERS ===== */

    // checks if msg.sender owns the curation pass NFT
    modifier curationPassCheck() {
        require(
            IERC721(seasonDetails.curationPassAddress).balanceOf(msg.sender) >
                0,
            "you do not own the Curation Pass NFT"
        );
        _;
    }

    // checks if listing is already present in curation list
    modifier duplicateCheck(address _listing) {
        require(
            viewCuratorByListingBySeason(curationSeason, _listing) ==
                address(0),
            "you cannot add a listing that is already on the curation list for this season"
        );
        _;
    }

    // checks if there is curationLimit has been reached
    modifier limitCheck() {
        require(
            currentSeasonListings.length < seasonDetails.curationLimit,
            "the curation list is full. remove a listing before adding another"
        );
        _;
    }

    // checks if msg.sender is the curator for the listing being removed
    modifier removalCheck(address _listing) {
        require(
            msg.sender == curationSeasonDashboard[curationSeason][_listing],
            "you can only remove listings you have curated yourself"
        );
        _;
    }

    // checks if inputted listing + curator addresses are equal to address(0)
    modifier zeroAddressCheck(address _listing, address _curator) {
        require(
            _listing != address(0),
            "listing address cannot be the zero address"
        );
        require(
            _curator != address(0),
            "curator address cannot be the zero address"
        );
        _;
    }

    // checks if curation functionality is paused
    modifier pauseCheck() {
        require(
            seasonDetails.pauseState == false,
            "all curatorial functions are currently paused"
        );
        _;
    }

    /* ===== CONSTRUCTOR ===== */

    // initializes curation
    constructor(
        string memory _curationEntity,
        string memory _curationSeasonTitle,
        address _initialCurationPassAddress,
        uint256 _initialCurationLimit,
        bool _initialPauseState
    ) {
        curationEntity = _curationEntity;
        seasonDetails.title = _curationSeasonTitle;
        seasonDetails.curationPassAddress = _initialCurationPassAddress;
        seasonDetails.curationLimit = _initialCurationLimit;
        seasonDetails.pauseState = _initialPauseState;
        curationSeason = 1;
    }

    /* ===== OWNER FUNCTIONS ===== */

    // update curation entity name
    function setCurationEntity(string calldata _newCurationEntity)
        external
        onlyOwner
    {
        curationEntity = _newCurationEntity;
    }

    // update curation season name
    function setCurationSeasonTitle(string calldata _newCurationSeasonTitle)
        external
        onlyOwner
    {
        seasonDetails.title = _newCurationSeasonTitle;
    }

    // update ERC721 contract being used to token gate functionality to this contract
    function setCurationPassAddress(address _curationPassAddress)
        external
        onlyOwner
    {
        seasonDetails.curationPassAddress = _curationPassAddress;
    }

    // update maximum number of listings that can be stored within curation list
    function setCurationLimit(uint256 _newCurationLimit) external onlyOwner {
        require(
            _newCurationLimit > currentSeasonListings.length,
            "cannot set curationLimit to value equal to or smaller than current length of currentSeasonListings array"
        );
        seasonDetails.curationLimit = _newCurationLimit;
    }

    // update pause state
    function setPauseState(bool _newPauseState) external onlyOwner {
        require(
            _newPauseState = !seasonDetails.pauseState,
            "you cannot update the pause state to its current value"
        );
        // curationPauseState = _newPauseState;
        seasonDetails.pauseState = _newPauseState;
    }

    /// @notice contract owner listing removal function without
    //          removalCheck, pauseCheck, or curationPassCheck
    function ownerRemoveListing(address _listing, address _curator)
        external
        onlyOwner
        nonReentrant
    {
        require(
            curationSeasonDashboard[curationSeason][_listing] == _curator,
            "curator address is not mapped to inputted listing"
        );
        listingsArrayRemoval(_listing);
        delete curationSeasonDashboard[curationSeason][_listing];
    }

    /// @notice contract owner listing add function without
    //          pauseCheck or curationPassCheck
    function ownerAddListing(address _listing, address _curator)
        external
        onlyOwner
        nonReentrant
        duplicateCheck(_listing)
        limitCheck
        zeroAddressCheck(_listing, _curator)
    {
        currentSeasonListings.push(_listing);
        curationSeasonDashboard[curationSeason][_listing] = _curator;
    }

    function resetCurrentSeason() external onlyOwner nonReentrant {
        require(
            currentSeasonListings.length > 0,
            "cannot call this function when the curation list is empty"
        );
        for (uint256 i = 0; i < currentSeasonListings.length; i++) {
            curationSeasonDashboard[curationSeason][
                currentSeasonListings[i]
            ] = address(0);
        }
        delete currentSeasonListings;
    }

    function finalizeSeason(
        string memory _newCurationSeasonTitle,
        address _newCurationPassAddress,
        uint256 _newCurationLimit,
        bool _newPauseState
    ) external onlyOwner nonReentrant {
        seasonDetails.pauseState = true;
        curationSeasonArchive[curationSeason] = abi.encode(
            currentSeasonListings,
            seasonDetails.title,
            seasonDetails.curationPassAddress,
            seasonDetails.curationLimit
        );
        delete currentSeasonListings;

        curationSeason++;

        seasonDetails.title = _newCurationSeasonTitle;
        seasonDetails.curationPassAddress = _newCurationPassAddress;
        seasonDetails.curationLimit = _newCurationLimit;
        seasonDetails.pauseState = _newPauseState;
    }

    /* ===== CURATION FUNCTIONS ===== */

    // adds listing to array of all active listings + assings curator to listing -> curator mapping
    function addListing(address _listing, address _curator)
        external
        nonReentrant
        pauseCheck
        curationPassCheck
        duplicateCheck(_listing)
        limitCheck
        zeroAddressCheck(_listing, _curator)
    {
        currentSeasonListings.push(_listing);
        curationSeasonDashboard[curationSeason][_listing] = _curator;
    }

    /// @notice removes listing from array of all active listings +
    //          removes curator from listing -> curator mapping
    function removeListing(address _listing, address _curator)
        external
        nonReentrant
        pauseCheck
        curationPassCheck
        removalCheck(_listing)
    {
        require(
            curationSeasonDashboard[curationSeason][_listing] == _curator,
            "curator address is not mapped to inputted listing"
        );
        listingsArrayRemoval(_listing);
        delete curationSeasonDashboard[curationSeason][_listing];
    }

    /// @notice removes listing from array of all active listings
    //          can only be called internally by removeListing function
    function listingsArrayRemoval(address _listing) internal {
        for (uint256 i = 0; i < currentSeasonListings.length; i++) {
            if (currentSeasonListings[i] == _listing) {
                currentSeasonListings[i] = currentSeasonListings[
                    currentSeasonListings.length - 1
                ];
                currentSeasonListings.pop();
            }
        }
    }

    /* ===== VIEW FUNCTIONS ===== */

    // view function that returns curation entity name
    function viewCurationEntity() external view returns (string memory) {
        return curationEntity;
    }

    // view function that returns current curation season
    function viewCurationSeason() external view returns (uint256) {
        return curationSeason;
    }

    // view seasonDetails
    function viewSeasonDetails()
        external
        view
        returns (
            string memory,
            address,
            uint256,
            bool
        )
    {
        return (
            seasonDetails.title,
            seasonDetails.curationPassAddress,
            seasonDetails.curationLimit,
            seasonDetails.pauseState
        );
    }

    // view function that returns curation season title
    function viewCurationSeasonTitle() external view returns (string memory) {
        return seasonDetails.title;
    }

    // view function that returns the maximum number of listings the curation list can hold
    function viewCurationLimit() external view returns (uint256) {
        return seasonDetails.curationLimit;
    }

    // view function that returns current state of curationPauseState
    function viewCurationPauseState() external view returns (bool) {
        return seasonDetails.pauseState;
    }

    // view function that returns address of NFT contract being used as curation pass
    function viewCurationPassAddress() external view returns (address) {
        return seasonDetails.curationPassAddress;
    }

    // view function that returns array of all active listings
    function viewCurrentSeasonListings()
        external
        view
        returns (address[] memory)
    {
        // returns empty array if no active listings
        return currentSeasonListings;
    }

    // view function that returns the curator of a given listing from the current season
    function viewCuratorByListingBySeason(
        uint256 _curationSeason,
        address _listing
    ) public view returns (address) {
        // returns address(0) if no curator associated with a given curation season + listing
        return curationSeasonDashboard[_curationSeason][_listing];
    }

    // view function that returns an array of all listings curator has curated that season
    function viewCurrentSeasonSummaryByCurator(address _curator)
        external
        view
        returns (address[] memory)
    {
        address[] memory curatorSummary;
        for (uint256 i; i < currentSeasonListings.length; i++) {
            if (
                curationSeasonDashboard[curationSeason][
                    currentSeasonListings[i]
                ] == _curator
            ) {
                curatorSummary[i] = (currentSeasonListings[i]);
            }
        }
        return curatorSummary;
    }

    // view function that returns an array of all listings curator has curated in a previous season
    function viewArchivalSeasonSummaryByCurator(
        uint256 _curationSeason,
        address _curator
    ) external view returns (address[] memory) {
        address[] memory curatorSummary;
        address[] memory archivalListings;
        (archivalListings, , , ) = viewCurationArchive(_curationSeason);
        for (uint256 i; i < archivalListings.length; i++) {
            if (
                viewCuratorByListingBySeason(
                    _curationSeason,
                    archivalListings[i]
                ) == _curator
            ) {
                curatorSummary[i] = archivalListings[i];
            }
        }
        return curatorSummary;
    }

    // view function that returns decoded array of curated listings from a previous season
    function viewCurationArchive(uint256 _curationSeason)
        public
        view
        returns (
            address[] memory pastSeasonListings,
            string memory pastSeasonTitle,
            address pastSeasonCurationPassAddress,
            uint256 pastSeasonCurationLimit
        )
    {
        (
            pastSeasonListings,
            pastSeasonTitle,
            pastSeasonCurationPassAddress,
            pastSeasonCurationLimit
        ) = abi.decode(
            curationSeasonArchive[_curationSeason],
            (address[], string, address, uint256)
        );

        // returns an error if you enter current or feature curation season #
        return (
            pastSeasonListings,
            pastSeasonTitle,
            pastSeasonCurationPassAddress,
            pastSeasonCurationLimit
        );
    }

    function hasCurationLimitBeenReached() external view returns (bool) {
        if (currentSeasonListings.length < seasonDetails.curationLimit) {
            return false;
        } else {
            return true;
        }
    }

    // view function that checks an addresses' balance of the curation pass NFT
    function viewUserBalanceOfCurationPass(address _address)
        external
        view
        returns (uint256)
    {
        return IERC721(seasonDetails.curationPassAddress).balanceOf(_address);
    }
}
