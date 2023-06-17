// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;
import { ERC20 } from "openzeppelin/token/ERC20/ERC20.sol";
import { Ownable } from "openzeppelin/access/Ownable.sol";

contract TransToken is ERC20, Ownable{

    uint8 internal _decimals;
    mapping(address => bool) internal _minters;

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

   function configureMinter(address minter)
        external
        onlyOwner
        returns (bool)
    {
        _minters[minter] = !_minters[minter];
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
}