// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// A dummy contract to be called via delegatecall
contract Worker {
    function doWork() external {}
}

contract DelegatecallInLoop {
    address public worker;

    constructor(address _worker) {
        worker = _worker;
    }

    // Vulnerable: Uses delegatecall inside a for-loop
    function doWorkInLoop(uint times) external {
        for (uint i = 0; i < times; i++) {
            // This is very dangerous!
            (bool success, ) = worker.delegatecall(
                abi.encodeWithSignature("doWork()")
            );
            require(success, "Delegatecall failed");
        }
    }
}
