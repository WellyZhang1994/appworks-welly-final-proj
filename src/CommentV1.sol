// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;
import "./CommentGovernance.sol";

contract CommentV1 is CommentGovernance{

    struct Comment {
        uint256 id;
        uint256 salary;
        uint256 createTime;
        string name;
        string description;
        Status status;
        CommentVotes votes;
    }

    struct CommentVotes{
        uint256 against;
        uint256 agree;
        uint256 abstain;
    }

    enum VoteTypes {
        Against,
        Agree,
        Abstain
    }

    enum Status {
        Voting,
        Completed
    }

    uint private comment_count = 1;

    mapping(address => Comment[]) private _commentsByAddress;

    function createComment(string calldata _name, string calldata _description, uint _salary)  external {

        uint256 createTimestamp = block.timestamp;
        Comment memory tempCom = Comment(
            {   
                id: comment_count,
                createTime: createTimestamp,
                name: _name, 
                description: _description, 
                salary: _salary,
                status: Status.Voting,
                votes: CommentVotes(0,0,0)
            }
        );

        comment_count ++;

        Comment[] storage comments = _commentsByAddress[msg.sender];
        comments.push(tempCom);

        _addVoting(tempCom.id);
    }

    function getCommentsByAddress(address creator) view external returns(Comment[] memory) {
        return _commentsByAddress[creator];
    }

    function executeVotingReward(uint commentId) external {
        return _executeVotingResult(commentId);
    }
}