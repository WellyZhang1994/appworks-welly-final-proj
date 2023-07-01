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
}

contract TransToken is ERC20, Ownable{
    
    uint8 internal _decimals;
    mapping(address => bool) internal _minters;
    mapping (address => uint256) public tickets;

    constructor(string memory name, string memory symbol, uint8 decimalsValue) ERC20(name, symbol) {
        _minters[msg.sender] = true;
        _decimals = decimalsValue;
    }

    modifier onlyMinters() {
        require(_minters[msg.sender], "TransToken: caller is not a minter");
        _;
    }    

    function mint(address to, uint256 amount) public onlyMinters{
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function isMinter(address account) external view returns (bool) {
        return _minters[account];
    }

   function addMinter(address minter)
        external
        onlyOwner
        returns (bool)
    {
        _minters[minter] = true;
        return true;
    }

    function removeMinter(address minter)
        external
        onlyOwner
        returns (bool)
    {
        _minters[minter] = false;
        return true;
    }    

    function getCurrentVotes(address voter) external view returns (uint256) {
        return tickets[voter];
    }

    function addOnTickets(uint256 amount) public returns (bool){
        return _addOnTickets(msg.sender,amount);
    }

    function _addOnTickets(address delegator, uint256 amount) internal returns (bool){
        require(balanceOf(delegator) >= amount, "TransToken: the balance of delegator is not sufficient");
        tickets[delegator] += amount;
        return true;
    }
}