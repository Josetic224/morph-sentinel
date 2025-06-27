// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract UncheckedCall {
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    // Vulnerable: The return value of the call is not checked.
    function vulnerableTransfer(address payable to, uint amount) external {
        to.call{value: amount}("");
    }

    // Secure: The return value is checked.
    function secureTransfer(address payable to, uint amount) external {
        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed.");
    }
}
