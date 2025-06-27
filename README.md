# Morph Sentinel

**Morph Sentinel** is a powerful, AI-driven security linter for smart contracts developed for the Morph ecosystem. It helps developers write more secure and optimized Solidity code by providing deep analysis and actionable suggestions.

## Installation

```bash
npm install -g .
```

## Usage

To analyze a Solidity file from the command line, simply run:

```bash
./src/index.js path/to/YourContract.sol
```

## Usage as a Library (SDK)

In addition to the CLI, you can use `Morph Sentinel` programmatically as a library in your own projects. This makes it easy to integrate our security analysis into your existing development workflows.

First, install it as a local dependency:
```bash
npm install /path/to/morph-sentinel
```

Then, you can use the `lint` function in your code:

```javascript
const { lint } = require('morph-sentinel');
const fs = require('fs');

const sourceCode = fs.readFileSync('path/to/YourContract.sol', 'utf8');
const issues = lint(sourceCode);

// issues is an array of issue objects
console.log(issues);
```

## Implemented Security Rules

Morph Sentinel currently detects the following vulnerabilities:

*   **`no-reentrancy`**: Detects potential re-entrancy vulnerabilities where state is modified after an external call.
*   **`no-tx-origin`**: Warns against the use of `tx.origin` for authorization, which can be unsafe.
*   **`no-self-destruct`**: Flags the use of the deprecated and dangerous `selfdestruct` opcode.
*   **`no-unchecked-call-return`**: Ensures that the return value of low-level calls (`.call`, `.send`, etc.) is checked.
*   **`no-delegatecall-in-loop`**: Prevents the dangerous use of `delegatecall` inside loops.
*   **`no-floating-pragma`**: Enforces the use of a locked pragma to prevent compilation with unintended Solidity versions.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.
