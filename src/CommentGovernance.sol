// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;
import "./Timelock.sol";
import "./QuadraticRewardModel.sol";

contract CommentGovernance is Timelock, QuadraticRewardModel{

    mapping (uint256 => VotingInfo) internal _votes;

    function executeable(uint256 commentId) view external returns(bool){
        return _executeable(_votes[commentId]);
    }

    function _addVoting(uint256 commentId) internal {
        require(_votes[commentId].commentId == 0, "CommentGovernance: the voting is existed!");
        VotingInfo memory voteInfo;
        voteInfo.commentId = commentId;
        voteInfo.createTime = block.timestamp;
        voteInfo.isExecute = false;
        _votes[commentId] = voteInfo;
        _addVotingQueue(voteInfo);
    }

    function _claimResult(uint commentId, uint256[] memory against, uint256[] memory agree) internal returns(uint256){
        uint256 reward = 0;
        require(_votes[commentId].isExecute == false, "CommentGovernance: execute: the voting is executed!");
        bool canExecute = _executeable(_votes[commentId]);
        if (canExecute) {
            _votes[commentId].isExecute = true;
            reward = _getReward(against, agree);
        }
        return reward;
    }
}