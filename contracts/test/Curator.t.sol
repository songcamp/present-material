// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Curator.sol";

import "./TestToken.sol";

contract CuratorTest is Test {
    PresentMaterialsCurator public curator;
    TestToken public testToken;

    function setUp() public {
        testToken = new TestToken();
        curator = new PresentMaterialsCurator(address(testToken));
    }

    function testDeploy() public {
        assertEq(testToken.name(), "TEST");
    }

    function testAddCurator() public {
        address target = address(0x10);
        testToken.mint(target);
        assertEq(testToken.balanceOf(target), 1);
        vm.prank(target);
        curator.addCurator(target, address(0x12));
    }

    function testAddManyCurator() public {
        for (uint256 i = 0; i < 100; i++) {
            address target = address(uint160(uint160(address(this)) + i + 1));
            testToken.mint(target);
            vm.prank(target);
            curator.addCurator(target, address(0x12));
        }
    }

    function testAddAndRemoveManyCurator() public {
        for (uint256 i = 0; i < 100; i++) {
            address target = address(uint160(uint160(address(this)) + i));
            testToken.mint(target);
            curator.addCurator(target, address(0x12));
        }
        for (uint256 i = 0; i < 100; i++) {
            address target = address(uint160(uint160(address(this)) + i));
            curator.removeCurator(address(0x12), target);
        }
    }
}
