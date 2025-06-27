// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vulnerable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
