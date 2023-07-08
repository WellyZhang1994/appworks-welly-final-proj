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
    function getPriorVotes(address account, uint blockNumber)  external view returns (uint256);
    function addOnTickets(uint256 amount) external returns (bool);
    function consumeTickets(address consumer, uint256 amount) external returns (bool);
}

contract TransToken is ERC20, Ownable{
    
    uint8 internal _decimals;
    mapping(address => bool) public allowers;
    mapping (address => address) public delegates;

    struct Checkpoint {
        uint currentVotes;
        uint lastAddonTime;
    }

    mapping (address => Checkpoint) public checkpoints;

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

    function addOnTickets(uint256 amount) public {
        uint lastAddonTime = checkpoints[msg.sender].lastAddonTime;
        require(lastAddonTime == 0 || lastAddonTime + 1 days <= block.timestamp, "TransToken: Can only add on tickets once a day");
        require(balanceOf(msg.sender) >= amount, "TransToken: the balance of delegator is not sufficient");
        _moveDelegates(msg.sender, amount, true);
    }

    function consumeTickets(address consumer, uint256 amount) public onlyAllowers returns (bool){
        require(this.getCurrentVotes(consumer) >= amount, "TransToken: the balance of tickeks is not sufficient");
        return _consumeTickets(consumer, amount);
    }

    function _consumeTickets(address consumer, uint256 amount) private returns (bool){
        _moveDelegates(consumer, amount, false);
        return true;
    }

    function deposit() external payable {
        _mint(msg.sender, msg.value);
    }

    function getCurrentVotes(address account) external view returns (uint) {
        return checkpoints[account].currentVotes;
    }

    function _moveDelegates(address changer, uint256 amount, bool isAddedon) internal {
        if (isAddedon == true) {
            checkpoints[changer].lastAddonTime = block.timestamp;
        }
        if (changer != address(0) && amount > 0) {
            uint srcRepOld = checkpoints[changer].currentVotes;
            uint srcRepNew = isAddedon == true ? srcRepOld + amount : srcRepOld - amount;
            _writeCheckpoint(changer, srcRepNew);
        }
    }

    function _writeCheckpoint(address delegatee, uint newVotes) internal {
        checkpoints[delegatee].currentVotes = newVotes;
    }
}