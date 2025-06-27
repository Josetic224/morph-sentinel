const { lint } = require('../src/linter');

describe('Linter Rules', () => {
  describe('no-floating-pragma', () => {
    it('should detect a floating pragma version', () => {
      const sourceCode = 'pragma solidity ^0.8.0;\n\ncontract MyContract {}';
      const issues = lint(sourceCode);

      expect(issues).toHaveLength(1);
      expect(issues[0]).toEqual({
        line: 1,
        column: 0,
        message: 'Avoid using floating pragma "^". Lock the version (e.g., "0.8.20").',
        rule: 'no-floating-pragma',
        severity: 'warning',
      });
    });

    it('should not detect a locked pragma version', () => {
      const sourceCode = 'pragma solidity 0.8.20;\n\ncontract MyContract {}';
      const issues = lint(sourceCode);

      expect(issues).toHaveLength(0);
    });
  });

  describe('no-tx-origin', () => {
    it('should detect tx.origin usage', () => {
      const sourceCode = `
pragma solidity 0.8.20;
contract Unsafe {
  function unsafe() public view {
    require(tx.origin == msg.sender);
  }
}`;
      const issues = lint(sourceCode);
      expect(issues).toHaveLength(1);
      expect(issues[0]).toEqual({
        line: 5,
        column: 12,
        message: "Using 'tx.origin' for authorization is insecure. Use 'msg.sender' instead.",
        rule: 'no-tx-origin',
        severity: 'error',
      });
    });

    it('should not flag msg.sender usage', () => {
      const sourceCode = `
pragma solidity 0.8.20;
contract Safe {
  function safe() public view {
    require(msg.sender == address(this));
  }
}`;
      const issues = lint(sourceCode);
      expect(issues).toHaveLength(0);
    });
  });

  describe('no-reentrancy', () => {
    it('should detect state changes after external calls', () => {
      const sourceCode = `
pragma solidity 0.8.20;
contract Vulnerable {
    mapping(address => uint) public balances;
    function withdraw() public {
        (bool success, ) = msg.sender.call{value: balances[msg.sender]}("");
        require(success);
        balances[msg.sender] = 0;
    }
}`;
      const issues = lint(sourceCode);
      expect(issues).toHaveLength(1);
      expect(issues[0]).toEqual({
        line: 8,
        column: 8,
        message: 'State is modified after an external call, which can lead to re-entrancy vulnerabilities.',
        rule: 'no-reentrancy',
        severity: 'error',
      });
    });

    it('should not flag state changes before external calls', () => {
      const sourceCode = `
pragma solidity 0.8.20;
contract Safe {
    mapping(address => uint) public balances;
    function withdraw() public {
        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
    }
}`;
      const issues = lint(sourceCode);
      expect(issues).toHaveLength(0);
    });
  });

  describe('no-self-destruct', () => {
    it('should detect selfdestruct usage', () => {
      const sourceCode = `
pragma solidity 0.8.20;
contract Unsafe {
    function kill() public {
        selfdestruct(payable(msg.sender));
    }
}`;
      const issues = lint(sourceCode);
      expect(issues).toHaveLength(1);
      expect(issues[0]).toEqual({
        line: 5,
        column: 8,
        message: 'Use of selfdestruct is deprecated. Consider implementing a withdrawal pattern instead.',
        rule: 'no-self-destruct',
        severity: 'warning',
      });
    });

    it('should not flag contracts without selfdestruct', () => {
      const sourceCode = `
pragma solidity 0.8.20;
contract Safe {
    function withdraw() public {}
}`;
      const issues = lint(sourceCode);
      expect(issues).toHaveLength(0);
    });
  });

  describe('no-unchecked-call-return', () => {
    it('should detect unchecked low-level call return values', () => {
      const sourceCode = `
pragma solidity 0.8.20;
contract Unsafe {
    function unsafe(address payable to) public {
        to.call{value: 1 ether}("");
    }
}`;
      const issues = lint(sourceCode);
      expect(issues).toHaveLength(1);
      expect(issues[0]).toEqual({
        line: 5,
        column: 8,
        message: 'The return value of the low-level call to "call" should be checked.',
        rule: 'no-unchecked-call-return',
        severity: 'warning',
      });
    });

    it('should not flag checked low-level call return values', () => {
      const sourceCode = `
pragma solidity 0.8.20;
contract Safe {
    function safe(address payable to) public {
        (bool success, ) = to.call{value: 1 ether}("");
        require(success);
    }
}`;
      const issues = lint(sourceCode);
      expect(issues).toHaveLength(0);
    });
  });

  describe('no-delegatecall-in-loop', () => {
    it('should detect delegatecall inside a loop', () => {
      const sourceCode = `
pragma solidity 0.8.20;
contract Worker {
    function doWork() external {}
}
contract Unsafe {
    address public worker;
    function doWorkInLoop(uint times) external {
        for (uint i = 0; i < times; i++) {
            (bool success, ) = worker.delegatecall(abi.encodeWithSignature("doWork()"));
            require(success);
        }
    }
}`;
      const issues = lint(sourceCode);
      expect(issues).toHaveLength(1);
      expect(issues[0]).toEqual({
        line: 10,
        column: 31,
        message: 'Avoid using delegatecall inside a loop.',
        rule: 'no-delegatecall-in-loop',
        severity: 'error',
      });
    });

    it('should not flag delegatecall outside a loop', () => {
      const sourceCode = `
pragma solidity 0.8.20;
contract Worker {
    function doWork() external {}
}
contract Safe {
    address public worker;
    function doWorkOnce() external {
        (bool success, ) = worker.delegatecall(abi.encodeWithSignature("doWork()"));
        require(success);
    }
}`;
      const issues = lint(sourceCode);
      expect(issues).toHaveLength(0);
    });
  });
});
