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
        uint fromBlock;
        uint votes;
    }

    mapping (address => mapping (uint => Checkpoint)) public checkpoints;
    mapping (address => uint) public numCheckpoints;

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
        require(balanceOf(msg.sender) >= amount, "TransToken: the balance of delegator is not sufficient");
        _delegate(msg.sender, amount, true);
    }

    function consumeTickets(address consumer, uint256 amount) public onlyAllowers returns (bool){
        require(this.getCurrentVotes(consumer) >= amount, "TransToken: the balance of tickeks is not sufficient");
        return _consumeTickets(consumer, amount);
    }

    function _consumeTickets(address consumer, uint256 amount) private returns (bool){
        _delegate(consumer, amount, false);
        return true;
    }

    function deposit() external payable {
        _mint(msg.sender, msg.value);
    }

    function getCurrentVotes(address account) external view returns (uint) {
        uint nCheckpoints = numCheckpoints[account];
        return nCheckpoints > 0 ? checkpoints[account][nCheckpoints - 1].votes : 0;
    }

    function getPriorVotes(address account, uint blockNumber) public view returns (uint) {
        require(blockNumber <= block.number, "TransToken: getPriorVotes: not yet determined");

        uint nCheckpoints = numCheckpoints[account];
        if (nCheckpoints == 0) {
            return 0;
        }

        if (checkpoints[account][nCheckpoints - 1].fromBlock <= blockNumber) {
            return checkpoints[account][nCheckpoints - 1].votes;
        }

        if (checkpoints[account][0].fromBlock > blockNumber) {
            return 0;
        }

        uint lower = 0;
        uint upper = nCheckpoints - 1;
        while (upper > lower) {
            uint center = upper - (upper - lower) / 2; 
            Checkpoint memory cp = checkpoints[account][center];
            if (cp.fromBlock == blockNumber) {
                return cp.votes;
            } else if (cp.fromBlock < blockNumber) {
                lower = center;
            } else {
                upper = center - 1;
            }
        }
        return checkpoints[account][lower].votes;
    }

    function _delegate(address changer, uint256 amount, bool isAddedon) internal {
        _moveDelegates(changer, amount, isAddedon);
    }

    function _moveDelegates(address changer, uint256 amount, bool isAddedon) internal {
        if (changer != address(0) && amount > 0) {
            uint srcRepNum = numCheckpoints[changer];
            uint srcRepOld = srcRepNum > 0 ? checkpoints[changer][srcRepNum - 1].votes : 0;
            uint srcRepNew = isAddedon == true ? srcRepOld + amount : srcRepOld - amount;
            _writeCheckpoint(changer, srcRepNum, srcRepNew);
        }
    }

    function _writeCheckpoint(address delegatee, uint nCheckpoints, uint newVotes) internal {
      uint blockNumber = block.number;
      if (nCheckpoints > 0 && checkpoints[delegatee][nCheckpoints - 1].fromBlock == blockNumber) {
          checkpoints[delegatee][nCheckpoints - 1].votes = newVotes;
      } else {
          checkpoints[delegatee][nCheckpoints] = Checkpoint(blockNumber, newVotes);
          numCheckpoints[delegatee] = nCheckpoints + 1;
      }
    }
}