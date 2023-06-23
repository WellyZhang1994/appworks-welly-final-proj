// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;
import "./RewardModelInterface.sol";

contract QuadraticRewardModel is RewardModelInterface {
    function getReward(uint against, uint agree, uint abstain) override internal view returns (uint) {
        return 1e18;
    }
}