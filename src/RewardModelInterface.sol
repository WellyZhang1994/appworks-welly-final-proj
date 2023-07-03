// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

abstract contract RewardModelInterface {
    bool public constant IS_REWARD_MODEL = true;
    function _getReward(uint256[] memory against, uint256[] memory agree) virtual internal pure returns (uint256);
}