// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "forge-std/Test.sol";
import "../src/CommentV1.sol";
import "../src/CommentProxy.sol";

contract TransTokenTest is Test {

    CommentV1 public comm;
    CommentProxy public proxy;
    CommentV1 public commentsProxy;
    address _admin = makeAddr("admin");
    address _user1 = makeAddr("user1");

    function setUp() public {
        vm.startPrank(_admin);
        comm = new CommentV1();
        proxy = new CommentProxy(address(comm));

        vm.stopPrank();
    }

    function testProxiable() public {
        vm.startPrank(_user1);
        commentsProxy = CommentV1(address(proxy));
        assertEq(commentsProxy.getCommentsByAddress(_user1).length, 0);
        vm.stopPrank();        
    }
}