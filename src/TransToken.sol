// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;
import { ERC20 } from "openzeppelin/token/ERC20/ERC20.sol";
import { Ownable } from "openzeppelin/access/Ownable.sol";

interface ITransToken {
    function mint(address to, uint256 amount) external;
    function decimals() external returns (uint8);
    function isMinter(address account) external view returns (bool);
    function addAllower(address minter) external returns (bool);
    function removeAllower(address minter) external returns (bool);
    function getCurrentVotes(address voter) external view returns (uint256);
    function addOnTickets(uint256 amount) external returns (bool);
    function consumeTickets(address consumer, uint256 amount) external returns (bool);
}

contract TransToken is ERC20, Ownable{
    
    uint8 internal _decimals;
    mapping(address => bool) public allowers;
    mapping (address => uint256) public tickets;

    constructor(string memory name, string memory symbol, uint8 decimalsValue) ERC20(name, symbol) {
        allowers[msg.sender] = true;
        _decimals = decimalsValue;
    }

    modifier onlyAllowers() {
        require(allowers[msg.sender], "TransToken: caller is not a allower");
        _;
    }    

    function mint(address to, uint256 amount) public onlyAllowers{
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function isMinter(address account) external view returns (bool) {
        return allowers[account];
    }

   function addAllower(address minter)
        external
        onlyOwner
        returns (bool)
    {
        allowers[minter] = true;
        return true;
    }

    function removeAllower(address minter)
        external
        onlyOwner
        returns (bool)
    {
        allowers[minter] = false;
        return true;
    }    

    function getCurrentVotes(address voter) external view returns (uint256) {
        return tickets[voter];
    }

    function addOnTickets(uint256 amount) public returns (bool){
        return _addOnTickets(msg.sender,amount);
    }

    function _addOnTickets(address delegator, uint256 amount) private returns (bool){
        require(balanceOf(delegator) >= amount, "TransToken: the balance of delegator is not sufficient");
        tickets[delegator] += amount;
        return true;
    }

    function consumeTickets(address consumer, uint256 amount) public onlyAllowers returns (bool){
        return _consumeTickets(consumer, amount);
    }

    function _consumeTickets(address consumer, uint256 amount) private returns (bool){
        require(tickets[consumer] >= amount, "TransToken: the balance of tickeks is not sufficient");
        tickets[consumer] -= amount;
        return true;
    }

    function deposit() external payable {
        _mint(msg.sender, msg.value);
    }
}