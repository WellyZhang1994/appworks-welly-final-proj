// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;
import "./CommentGovernance.sol";
import "./TransToken.sol";

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
        uint256[] against;
        uint256[] agree;
    }

    enum VoteTypes {
        Against,
        Agree
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
    mapping(uint256 => mapping(address => bool)) isVoted;

    ITransToken transToken;

    constructor(address _transToken) {
        transToken = ITransToken(_transToken);
    }

    function createComment(string calldata _name, string calldata _description, uint _salary)  external {
        uint256 createTimestamp = block.timestamp;
        uint256[] memory against;
        uint256[] memory agree;
        Comment memory tempCom = Comment(
            {   
                id: comment_count,
                createTime: createTimestamp,
                name: _name, 
                description: _description, 
                salary: _salary,
                creator: msg.sender,
                status: Status.Voting,
                votes: CommentVotes(against, agree)
            }
        );

        if(isCompanyExist[_name] == false)
        {
            isCompanyExist[_name] == true;
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

    function executeVotingReward(uint commentId, string calldata companyName) external returns(uint256) {
        CommentVotes memory v = commentDetail[companyName][commentId].votes;
        return _executeVotingResult(commentId, v.against, v.agree);
    }

    function vote(uint commentId, string calldata companyName, VoteTypes voteTypes, uint256 amount) external {
        require(isVoted[commentId][msg.sender] == false, "CommentV1: vote: you have voted!");
        require(transToken.getCurrentVotes(msg.sender) >= amount, "CommentV1: vote: you don't have enough votes!");
        Comment storage comment = commentDetail[companyName][commentId];
        CommentVotes storage currentVotes = comment.votes;
        if(voteTypes == VoteTypes.Against) { currentVotes.against.push(amount); }
        if(voteTypes == VoteTypes.Agree) { currentVotes.agree.push(amount);}
        isVoted[commentId][msg.sender] = true;
    }
}