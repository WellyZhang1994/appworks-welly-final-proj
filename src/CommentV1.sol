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

    uint private _commentCount = 1;
    mapping(string => bool) private _isCompanyExist;
    string[] private _companyList;
    mapping(string => mapping(uint256 => Comment)) private _commentDetail;
    mapping(string => Comment[]) private _commentsByCompany;
    mapping(uint256 => mapping(address => bool)) private _isVoted;

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
                id: _commentCount,
                createTime: createTimestamp,
                name: _name, 
                description: _description, 
                salary: _salary,
                creator: msg.sender,
                status: Status.Voting,
                votes: CommentVotes(against, agree)
            }
        );
        _commentDetail[_name][_commentCount] = tempCom;
        _commentCount ++;
        
        if(_isCompanyExist[_name] == false)
        {
            _isCompanyExist[_name] == true;
            _companyList.push(_name);
        }
        _commentsByCompany[_name].push(tempCom);
        _addVoting(tempCom.id);

    }

    function getCompanyList() external view returns (string[] memory){
        return _companyList;
    }

    function getCommentsByConpany(string calldata _company) external view returns (Comment[] memory){
        return _commentsByCompany[_company];
    }

    function getCommentDetails(uint commentId, string calldata companyName) external view returns (Comment memory){
        return _commentDetail[companyName][commentId];
    }

    function executeVotingReward(uint commentId, string calldata companyName) external returns(uint256) {
        Comment memory com = _commentDetail[companyName][commentId];
        require(com.status == Status.Voting, "CommentV1: executeVotingReward: comment is not in voting status!");
        require(com.creator == msg.sender, "CommentV1: executeVotingReward: you are not the creator of this comment!");
        CommentVotes memory v = com.votes;
        uint256 reward = _executeVotingResult(commentId, v.against, v.agree);
        if(reward > 0) {
            transToken.mint(com.creator, reward);
        }
        return reward;
    }

    function vote(uint commentId, string calldata companyName, VoteTypes voteTypes, uint256 amount) external {
        require(_isVoted[commentId][msg.sender] == false, "CommentV1: vote: you have voted!");
        require(transToken.getCurrentVotes(msg.sender) >= amount, "CommentV1: vote: you don't have enough votes!");
        Comment storage comment = _commentDetail[companyName][commentId];
        CommentVotes storage currentVotes = comment.votes;
        if(voteTypes == VoteTypes.Against) { currentVotes.against.push(amount); }
        if(voteTypes == VoteTypes.Agree) { currentVotes.agree.push(amount);}
        _isVoted[commentId][msg.sender] = true;
        transToken.consumeTickets(msg.sender, amount);
    }
}