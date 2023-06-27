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
        address creator;
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
    Comment[] public commentList;

    function createComment(string calldata _name, string calldata _description, uint _salary)  external {

        uint256 createTimestamp = block.timestamp;
        Comment memory tempCom = Comment(
            {   
                id: comment_count,
                createTime: createTimestamp,
                name: _name, 
                description: _description, 
                salary: _salary,
                creator: msg.sender,
                status: Status.Voting,
                votes: CommentVotes(0,0,0)
            }
        );

        comment_count ++;
        commentList.push(tempCom);

        _addVoting(tempCom.id);
    }

    function getCommentByAddress(address creator) external view returns (Comment[] memory){
        Comment[] memory tempComments = new Comment[](commentList.length);
        for (uint i = 0; i < commentList.length; i ++ )
        {
            if(commentList[i].creator == creator)
            {
                tempComments[tempComments.length] = commentList[i];
            }
        }
        return tempComments;
    }

    function executeVotingReward(uint commentId) external {
        return _executeVotingResult(commentId);
    }

    function vote(uint commentId, VoteTypes voteTypes, uint256 amount) external {
        Comment storage comments;
        for (uint i = 0; i < commentList.length; i ++ )
        {
            if(commentList[i].id == commentId)
            {
                comments = commentList[i];
                CommentVotes storage currentVotes = comments.votes;
                if(voteTypes == VoteTypes.Against) { currentVotes.against += amount;}
                if(voteTypes == VoteTypes.Agree) { currentVotes.agree += amount;}
                if(voteTypes == VoteTypes.Abstain) { currentVotes.abstain += amount;}
                break;
            }
        }
    }
}