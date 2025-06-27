// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Reentrancy {
    mapping(address => uint) public userBalances;

    function deposit() external payable {
        userBalances[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint balance = userBalances[msg.sender];
        require(balance > 0, "Insufficient balance");

        // FIX: State is updated BEFORE the external call.
        userBalances[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Failed to send Ether");
    }

    // Helper to check the contract's balance
    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}
