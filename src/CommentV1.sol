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

    struct CommentForView{
        uint256 id;
        string companyName;
    }

    enum VoteTypes {
        Against,
        Agree
    }

    enum Status {
        Voting,
        Completed
    }

    address private _transTokenAddress;
    uint256 private _commentCount = 0;
    string[] private _companyList;
    mapping(string => bool) private _isCompanyExist;
    mapping(address => CommentForView[]) private _commentByAddress;
    mapping(string => mapping(uint256 => Comment)) private _commentDetail;
    mapping(string => Comment[]) private _commentsByCompany;
    mapping(uint256 => mapping(address => bool)) private _isVoted;

    function initialize(address _tokenAddress) external{
        require(_transTokenAddress == address(0), "CommentV1: initialize: already initialized!");
        _transTokenAddress = _tokenAddress;
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
        _commentByAddress[msg.sender].push(CommentForView(_commentCount, _name));
        if(_isCompanyExist[_name] == false)
        {
            _isCompanyExist[_name] = true;
            _companyList.push(_name);
        }
        _commentsByCompany[_name].push(tempCom);
        _addVoting(tempCom.id);
        _commentCount ++;
    }

    function getCompanyList() external view returns (string[] memory){
        return _companyList;
    }

    function getCommentsByCompany(string calldata _company) external view returns (Comment[] memory){
        return _commentsByCompany[_company];
    }

    function getCommentsByAddress(address owner) external view returns (Comment[] memory){
        CommentForView[] memory commentView = _commentByAddress[owner];
        Comment[] memory coms = new Comment[](commentView.length);
        for(uint i=0; i< commentView.length; i++) {
            Comment memory com = _commentDetail[commentView[i].companyName][commentView[i].id];
            coms[i] = com;
        }
        return coms;
    }

    function getCommentDetails(uint commentId, string calldata companyName) external view returns (Comment memory){
        return _commentDetail[companyName][commentId];
    }

    function claimVotingReward(uint commentId, string calldata companyName) external returns(uint256) {
        Comment memory com = _commentDetail[companyName][commentId];
        require(com.status == Status.Voting, "CommentV1: claimVotingReward: comment is not in voting status!");
        require(com.creator == msg.sender, "CommentV1: claimVotingReward: you are not the creator of this comment!");
        CommentVotes memory v = com.votes;
        uint256 reward = _claimResult(commentId, v.against, v.agree);
        if(reward > 0) {
            ITransToken(_transTokenAddress).mint(com.creator, reward);
        }
        _commentDetail[companyName][commentId].status = Status.Completed;
        return reward;
    }

    function vote(uint commentId, string calldata companyName, VoteTypes voteTypes, uint256 amount) external {
        require(_isVoted[commentId][msg.sender] == false, "CommentV1: vote: you have voted!");
        require(ITransToken(_transTokenAddress).getCurrentVotes(msg.sender) >= amount, "CommentV1: vote: you don't have enough votes!");
        Comment storage comment = _commentDetail[companyName][commentId];
        CommentVotes storage currentVotes = comment.votes;
        if(voteTypes == VoteTypes.Against) { currentVotes.against.push(amount); }
        if(voteTypes == VoteTypes.Agree) { currentVotes.agree.push(amount);}
        _isVoted[commentId][msg.sender] = true;
        ITransToken(_transTokenAddress).consumeTickets(msg.sender, amount);
    }
}