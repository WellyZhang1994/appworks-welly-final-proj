// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/CommentV1.sol";
import "../src/CommentProxy.sol";
import "../src/TransToken.sol";

contract TransTokenTest is Test {

    CommentV1 public comm;
    CommentProxy public proxy;
    CommentV1 public commentsProxy;
    TransToken public trans;

    address _admin = makeAddr("admin");
    address _user1 = makeAddr("user1");
    address _user2 = makeAddr("user2");

    function setUp() public {
        vm.startPrank(_admin);
        trans = new TransToken("APPWELLY","AW",18);
        comm = new CommentV1();
        proxy = new CommentProxy(address(comm));
        commentsProxy = CommentV1(address(proxy));
        commentsProxy.initialize(address(trans));
        trans.addAllower(address(commentsProxy));
        vm.stopPrank();
    }

    function testProxiable() public {
        vm.startPrank(_user1);
        assertEq(commentsProxy.getCompanyList().length, 0);
        vm.stopPrank();        
    }

    function testCreateComment() public {
        vm.startPrank(_user1);
        commentsProxy.createComment("test", "test", 100);
        vm.stopPrank();        
        assertEq(commentsProxy.getCompanyList().length, 1);
    }

    function testGetCommentsByAddress() public {
        vm.startPrank(_user1);
        commentsProxy.createComment("test", "test", 100);
        vm.stopPrank();        
        assertEq(commentsProxy.getCommentsByAddress(_user1).length, 1);
    }

    function testGetCommentsByCompany() public {
        vm.startPrank(_user1);
        commentsProxy.createComment("test", "test", 100);
        vm.stopPrank();        
        assertEq(commentsProxy.getCommentsByCompany("test").length, 1);
    }

    function testGetCommentDetails() public {
        vm.startPrank(_user1);
        commentsProxy.createComment("test", "test", 100);
        vm.stopPrank();
        CommentV1.Comment memory result = commentsProxy.getCommentDetails(0,"test");
        assertEq(result.id, 0);
        assertEq(result.name, "test");
        assertEq(result.description, "test");
        assertEq(result.salary, 100);        
    }

    function testVoting() public {
        deal(_user2, 1e18);
        vm.startPrank(_user1);
        commentsProxy.createComment("test", "test", 100);
        vm.stopPrank();
        vm.startPrank(_user2);
        trans.deposit{value: 1e18}();
        trans.addOnTickets(1e18);
        assertEq(trans.getCurrentVotes(_user2),1e18);
        CommentV1.Comment memory result = commentsProxy.getCommentDetails(0,"test");
        commentsProxy.vote(result.id, result.name, CommentV1.VoteTypes.Agree , 1e18);
        vm.stopPrank();
        CommentV1.Comment memory finalResult = commentsProxy.getCommentDetails(0,"test");
        assertEq(finalResult.votes.agree[0], 1e18);
        assertEq(trans.getCurrentVotes(_user2),0);
    }

    function testClaimVotingReward() public {
        deal(_user2, 1e18);
        vm.startPrank(_user1);
        commentsProxy.createComment("test", "test", 100);
        vm.stopPrank();
        vm.startPrank(_user2);
        trans.deposit{value: 1e18}();
        trans.addOnTickets(1e18);
        CommentV1.Comment memory result = commentsProxy.getCommentDetails(0,"test");
        assertEq(trans.getCurrentVotes(_user2), 1e18);
        commentsProxy.vote(result.id, result.name, CommentV1.VoteTypes.Agree , 1e18);
        assertEq(trans.getCurrentVotes(_user2), 0);
        vm.stopPrank();

        vm.startPrank(_user1);  
        vm.warp(block.timestamp + 1 days);
        uint256 reward = commentsProxy.claimVotingReward(0,"test");
        vm.stopPrank();
        assertEq(trans.balanceOf(_user1) , reward);
    }

    function testCommentExecutable() public {
        vm.startPrank(_user1);
        commentsProxy.createComment("test", "test", 100);
        vm.stopPrank();
        vm.expectRevert("Timelock: cannot execute during delay period!");
        assertEq(commentsProxy.executeable(0), false);
        vm.warp(block.timestamp + 1 days);
        assertEq(commentsProxy.executeable(0), true);
        vm.warp(block.timestamp + 7 days);
        vm.expectRevert("Timelock: cannot execute after grace period!");
        assertEq(commentsProxy.executeable(0), false);
    }
}