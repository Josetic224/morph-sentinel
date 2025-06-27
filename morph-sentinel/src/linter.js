const { parse } = require('@solidity-parser/parser');
const fs = require('fs');
const path = require('path');

// Load all rules from the rules directory
const rules = fs.readdirSync(path.join(__dirname, 'rules'))
    .map(file => require(path.join(__dirname, 'rules', file)));

// A custom AST traversal function that supports enter and exit visitors
function traverse(node, visitors, parent = null) {
    if (!node) return;

    // Add parent pointer
    node.parent = parent;

    const nodeType = node.type;
    const visitorFuncs = visitors[nodeType] || [];
    const exitVisitorFuncs = visitors[`${nodeType}:exit`] || [];

    visitorFuncs.forEach(func => func(node));

    for (const key in node) {
        if (node.hasOwnProperty(key) && key !== 'parent') {
            const child = node[key];
            if (Array.isArray(child)) {
                child.forEach(childNode => traverse(childNode, visitors, node));
            } else if (child && typeof child === 'object' && child.type) {
                traverse(child, visitors, node);
            }
        }
    }

    exitVisitorFuncs.forEach(func => func(node));
}

function lint(sourceCode) {
    let ast;
    try {
        ast = parse(sourceCode, { range: true, loc: true });
    } catch (e) {
        console.error('Error parsing Solidity file:', e.message);
        return [];
    }

    const issues = [];
    const ruleVisitors = {};

    // Create and combine visitors from all rules
    rules.forEach(rule => {
        const ruleContext = {
            report: (issue) => {
                issues.push({
                    line: issue.node.loc.start.line,
                    column: issue.node.loc.start.column,
                    message: issue.message,
                    rule: rule.rule,
                    severity: rule.meta.severity,
                });
            }
        };

        const visitor = rule.create(ruleContext);
        for (const nodeType in visitor) {
            if (!ruleVisitors[nodeType]) {
                ruleVisitors[nodeType] = [];
            }
            ruleVisitors[nodeType].push(visitor[nodeType]);
        }
    });

    // Traverse the AST with our custom traversal function
    traverse(ast, ruleVisitors);

    return issues;
}

module.exports = { lint };
