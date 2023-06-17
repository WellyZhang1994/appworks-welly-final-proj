// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "forge-std/Test.sol";
import "../src/TransToken.sol";

contract TransTokenTest is Test {

    TransToken public trans;
    address _admin = makeAddr("admin");
    address _user1 = makeAddr("user1");

    function setUp() public {
        vm.startPrank(_admin);
        trans = new TransToken("TRANSTOKEN", "TRA", 18);
        vm.stopPrank();
    }

    function testMintByOwner() public {
        vm.startPrank(_admin);
        trans.mint(_user1,1e18);
        vm.stopPrank();        

        assertEq(trans.balanceOf(_user1), 1e18);
    }
}