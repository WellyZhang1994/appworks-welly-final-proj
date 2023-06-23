// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract Timelock {

    struct VotingInfo {
        uint256 commentId;
        uint256 createTime;
        bool isExecute;
    }

    uint public constant GRACE_PERIOD = 7 days;
    uint public constant DELAY = 1 days;
    mapping (uint256 => VotingInfo) private queuedVoting;

    function _addVotingQueue(VotingInfo memory voteInfo) internal {
        queuedVoting[voteInfo.commentId] = voteInfo;
    }

    function _isAbleExecuted(VotingInfo memory voteInfo) internal view returns (bool) {
        require(getBlockTimestamp() >= voteInfo.createTime + DELAY, "Timelock: ");
        require(getBlockTimestamp() <= voteInfo.createTime + GRACE_PERIOD, "Timelock: ");
        return true;
    }

    function getBlockTimestamp() private view returns (uint) {
        return block.timestamp;
    }
}