// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MyContract {
    uint256 public value;
    
    event ValueChanged(uint256 newValue);
    
    function setValue(uint256 _value) public {
        value = _value;
        emit ValueChanged(_value);
    }
}