// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;
import { ERC20 } from "openzeppelin/token/ERC20/ERC20.sol";
import { Ownable } from "openzeppelin/access/Ownable.sol";

interface ITransToken {
    function mint(address to, uint256 amount) external returns (bool);
    function decimals() external returns (uint8);
    function isMinter(address account) external view returns (bool);
    function addMinter(address minter) external returns (bool);
    function removeMinter(address minter) external returns (bool);
    function getCurrentVotes(address voter) external view returns (uint256);
    function addOnTickets(uint256 amount) external returns (bool);
    function consumeTickets(address consumer, uint256 amount) external returns (bool);
}

contract TransToken is ERC20, Ownable{
    
    uint8 internal _decimals;
    mapping(address => bool) public minters;
    mapping (address => uint256) public tickets;

    constructor(string memory name, string memory symbol, uint8 decimalsValue) ERC20(name, symbol) {
        minters[msg.sender] = true;
        _decimals = decimalsValue;
    }

    modifier onlyMinters() {
        require(minters[msg.sender], "TransToken: caller is not a minter");
        _;
    }    

    function mint(address to, uint256 amount) public onlyMinters{
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function isMinter(address account) external view returns (bool) {
        return minters[account];
    }

   function addMinter(address minter)
        external
        onlyOwner
        returns (bool)
    {
        minters[minter] = true;
        return true;
    }

    function removeMinter(address minter)
        external
        onlyOwner
        returns (bool)
    {
        minters[minter] = false;
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

    function consumeTickets(address consumer, uint256 amount) public onlyMinters returns (bool){
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

    function withdraw(uint256 amount) external {
        _burn(msg.sender, amount);
        (bool error, ) = msg.sender.call{value: amount}("");
        require(error, "TransToken: withdraw failed");
    }    
}