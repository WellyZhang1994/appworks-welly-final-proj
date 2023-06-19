// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract CommentV1 {

    enum Status {
        Pending,
        Voting,
        Completed
    }

    struct Comment {
        bytes32 id;
        uint256 salary;
        uint256 createTime;
        string name;
        string description;
        Status status;
    }

    mapping(address => Comment[]) private _commentsByAddress;

    function createComment(string calldata _name, string calldata _description, uint _salary)  external {

        uint256 createTimestamp = block.timestamp;
        Comment memory tempCom = Comment(
            {   
                id: keccak256(abi.encode(_name,_description,createTimestamp)),
                createTime: createTimestamp,
                name: _name, 
                description: _description, 
                salary: _salary,
                status: Status.Pending
            }
        );
        Comment[] storage comments = _commentsByAddress[msg.sender];
        comments.push(tempCom);
    }

    function getCommentsByAddress(address creator) view external returns(Comment[] memory) {
        return _commentsByAddress[creator];
    }
}