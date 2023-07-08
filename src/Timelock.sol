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
    mapping (uint256 => VotingInfo) private _queuedVoting;

    function _addVotingQueue(VotingInfo memory voteInfo) internal {
        _queuedVoting[voteInfo.commentId] = voteInfo;
    }

    function _executeable(VotingInfo memory voteInfo) internal view returns (bool) {
        require(_getBlockTimestamp() >= voteInfo.createTime + DELAY, 'Timelock: cannot execute during delay period!' );
        require(_getBlockTimestamp() <= voteInfo.createTime + GRACE_PERIOD, 'Timelock: cannot execute after grace period!');
        return true;
    }

    function _getBlockTimestamp() private view returns (uint) {
        return block.timestamp;
    }
}