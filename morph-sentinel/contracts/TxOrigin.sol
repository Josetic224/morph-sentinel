// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract TxOrigin {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function withdraw() external {
        // This is a vulnerability! 
        // A malicious contract can call this function and drain the funds.
        require(tx.origin == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
