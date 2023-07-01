// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;
import "./Timelock.sol";
import "./QuadraticRewardModel.sol";

contract CommentGovernance is Timelock, QuadraticRewardModel{

    mapping (uint256 => VotingInfo) internal votes;

    function _addVoting(uint256 commentId) internal {
        require(votes[commentId].commentId == 0, "CommentGovernance: the voting is existed!");
        VotingInfo memory voteInfo;
        voteInfo.commentId = commentId;
        voteInfo.createTime = block.timestamp;
        voteInfo.isExecute = false;
        votes[commentId] = voteInfo;
        _addVotingQueue(voteInfo);
    }

    function _executeVotingResult(uint commentId, uint256[] memory against, uint256[] memory agree) internal returns(uint256){
        uint256 reward = 0;
        require(votes[commentId].isExecute == false, "CommentGovernance: execute: the voting is executed!");
        votes[commentId].isExecute = true;
        bool canExecute = _isAbleExecuted(votes[commentId]);
        if (canExecute) {
            reward = getReward(against, agree);
        }
        return reward;
    }
}