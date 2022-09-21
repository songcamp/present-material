// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "forge-std/Test.sol";

import {CurationSeason} from "../src/CurationSeason.sol";

import {TestToken} from "./TestToken.sol";

contract CurationSeasonTest is Test {
    event ListingAdded(address indexed curator, address indexed listingAddress);

    event ListingRemoved(
        address indexed curator,
        address indexed listingAddress
    );

    event SeasonFinalized(address indexed sender);

    CurationSeason public season;
    TestToken public curationPass;
    string public title = "My Curation";

    address public owner;
    address public listing1;
    address public listing2;

    function setUp() public {
        owner = 0xb4c79daB8f259C7Aee6E5b2Aa729821864227e84;

        curationPass = new TestToken();
        listing1 = makeAddr("listing 1");
        listing2 = makeAddr("listing 2");

        season = new CurationSeason(title, curationPass);
    }

    function test_ownerAddListing() public {
        vm.expectEmit(true, true, false, false);
        emit ListingAdded(owner, listing1);

        season.addListing(listing1);
    }

    function test_ownerRemoveListing() public {
        season.addListing(listing1);

        season.removeListing(listing1);
    }

    function test_findCuratorOfAddress() public {
        season.addListing(listing1);

        assertEq(season.listingCurators(listing1), owner);
    }

    function test_finalizingCuration() public {
        vm.expectEmit(true, false, false, false);
        emit SeasonFinalized(owner);
        season.finalizeSeason();

        vm.expectRevert(CurationSeason.Inactive.selector);

        season.addListing(listing1);
    }

    // function test_addListingAfterLimit() public {
    //     season.updateDetails(
    //         CurationSeason.SeasonDetails({
    //             title: title,
    //             curationPass: curationPass
    //         })
    //     );
    //     season.addListing(listing1);

    //     vm.expectRevert(CurationSeason.LimitReached.selector);
    // }

    function test_addListingWithoutPass() public {
        address curator1 = makeAddr("curator1");

        vm.startPrank(curator1);

        vm.expectRevert(CurationSeason.Access_MissingPass.selector);

        season.addListing(listing1);
    }

    function test_addDuplicateListing() public {
        address curator1 = makeAddr("curator1");

        address curator2 = makeAddr("curator2");

        curationPass.mint(curator1);
        curationPass.mint(curator2);

        vm.startPrank(curator1);

        season.addListing(listing1);

        vm.expectRevert(CurationSeason.ListingAlreadyExists.selector);
        season.addListing(listing1);

        vm.stopPrank();

        vm.startPrank(curator2);

        vm.expectRevert(CurationSeason.ListingAlreadyExists.selector);
        season.addListing(listing1);

        season.addListing(listing2);
    }

    function testAddManyCurator() public {
        for (uint256 i = 0; i < 100; i++) {
            address target = address(uint160(uint160(address(this)) + i + 1));
            curationPass.mint(target);
            vm.startPrank(target);

            vm.expectEmit(true, true, false, false);
            emit ListingAdded(target, address(0x12));

            season.addListing(address(0x12));

            vm.stopPrank();
        }
    }

    function testAddAndRemoveManyCurator() public {
        for (uint256 i = 0; i < 100; i++) {
            address target = address(uint160(uint160(address(this)) + i));
            curationPass.mint(target);
            season.addListing(target);
        }

        //     for (uint256 i = 0; i < 100; i++) {
        //         address listing = address(uint160(uint160(address(this)) + i));
        //         season.removeListing(address(0x12));
        //     }
    }
}
