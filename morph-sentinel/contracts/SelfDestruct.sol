// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract SelfDestruct {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    function kill() external {
        require(msg.sender == owner, "Only the owner can call this");
        selfdestruct(payable(owner));
    }
}
