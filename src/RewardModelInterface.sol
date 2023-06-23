// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

abstract contract RewardModelInterface {
    bool public constant isRewardModel = true;
    function getReward(uint against, uint agree, uint abstain) virtual internal view returns (uint);
}