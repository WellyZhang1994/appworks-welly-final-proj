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
    mapping(string => bool) public isCompanyExist;
    string[] public companyList;
    mapping(string => mapping(uint256 => Comment)) public commentDetail;
    mapping(string => Comment[]) public commentsByCompany;

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

        if(isCompanyExist[_name] == false)
        {
            companyList.push(_name);
        }
        commentsByCompany[_name].push(tempCom);
        commentDetail[_name][comment_count] = tempCom;
        _addVoting(tempCom.id);
        comment_count ++;
    }

    function getCompanyList() external view returns (string[] memory){
        return companyList;
    }

    function getCommentsByConpany(string calldata _company) external view returns (Comment[] memory){
        return commentsByCompany[_company];
    }

    function executeVotingReward(uint commentId) external {
        return _executeVotingResult(commentId);
    }

    function vote(uint commentId, string calldata companyName, VoteTypes voteTypes, uint256 amount) external {
        Comment storage comment = commentDetail[companyName][commentId];
        CommentVotes storage currentVotes = comment.votes;
        if(voteTypes == VoteTypes.Against) { currentVotes.against += amount;}
        if(voteTypes == VoteTypes.Agree) { currentVotes.agree += amount;}
        if(voteTypes == VoteTypes.Abstain) { currentVotes.abstain += amount;}
    }
}