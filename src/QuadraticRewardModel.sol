// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;
import "./RewardModelInterface.sol";

contract QuadraticRewardModel is RewardModelInterface {
    function getReward(uint256[] memory against, uint256[] memory agree) override internal pure returns (uint256) {
        uint256 againstRewardSquare = 0;
        uint256 agreeRewardSquare = 0;
        for (uint256 i = 0; i < against.length; i++) {
            againstRewardSquare += _sqrt(against[i]);
        }
        for (uint256 i = 0; i < agree.length; i++) {
            agreeRewardSquare += _sqrt(agree[i]);
        } 
        uint256 totalRewardSquare = agreeRewardSquare - againstRewardSquare;
        return totalRewardSquare == 0 ? 0 : totalRewardSquare ** totalRewardSquare;
    }

    function _sqrt(uint x) private pure returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
    }
}
}