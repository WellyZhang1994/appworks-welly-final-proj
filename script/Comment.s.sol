// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "forge-std/Script.sol";
import { TransToken } from "../src/TransToken.sol";
import { CommentGovernance } from "../src/CommentGovernance.sol";
import { CommentV1 } from "../src/CommentV1.sol";
import { CommentProxy } from "../src/CommentProxy.sol";
import { QuadraticRewardModel } from "../src/QuadraticRewardModel.sol";
import { RewardModelInterface } from "../src/RewardModelInterface.sol";
import { Timelock } from "../src/Timelock.sol";

contract CommentScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        CommentV1 comm;
        CommentProxy proxy;
        CommentV1 commentsProxy;
        TransToken trans;
        trans = new TransToken("APPWELLY","AW",18);
        comm = new CommentV1(address(trans));
        proxy = new CommentProxy(address(comm));
        commentsProxy = CommentV1(address(proxy));
        vm.stopBroadcast();
    }
}