// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "forge-std/Test.sol";
import "../src/TransToken.sol";

contract TransTokenTest is Test {

    TransToken public trans;
    address _admin = makeAddr("admin");
    address _user1 = makeAddr("user1");
    address _user2 = makeAddr("user2");
    address _user3 = makeAddr("user3");

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

    function testOwnerIsMinter() public {
        assertEq(trans.isMinter(_admin), true);
    }
    
    function testTicketUsage() public {
        vm.startPrank(_admin);
        trans.mint(_user1, 1e18);
        vm.stopPrank();

        vm.startPrank(_user1);
        trans.addOnTickets(10000);
        vm.stopPrank(); 
        assertEq(trans.getCurrentVotes(_user1),10000);

        vm.startPrank(_admin);
        trans.consumeTickets(_user1, 10000);
        vm.stopPrank(); 

        assertEq(trans.getCurrentVotes(_user1),0);
    }

    function testDeposit() public {
        deal(_user1, 1 ether);
        vm.startPrank(_user1);
        trans.deposit{ value: 1 ether }();
        vm.stopPrank(); 
        assertEq(trans.balanceOf(_user1), 1 ether);
    }

    function testCheckMinter() public {
        vm.startPrank(_admin);
        trans.addAllower(_user1);
        vm.stopPrank();

        vm.startPrank(_user1);
        trans.mint(_admin, 1e18);
        vm.stopPrank();
        assertEq(trans.balanceOf(_admin), 1e18);

        vm.startPrank(_user2);
        vm.expectRevert("TransToken: caller is not a allower");
        trans.mint(_admin, 1e18);
        vm.stopPrank();
    }

    function testVotesCount() public {
        deal(_user1, 1e18);
        vm.startPrank(_user1);
        trans.deposit{ value: 1e18 }();
        trans.addOnTickets(1e2);
        assertEq(trans.getCurrentVotes(_user1), 1e2);
        vm.expectRevert("TransToken: Can only add on tickets once a day");
        trans.addOnTickets(2e2);
        vm.warp(block.timestamp + 1 days);
        trans.addOnTickets(2e2);
        assertEq(trans.getCurrentVotes(_user1), 3e2);
        vm.stopPrank(); 
    }

}