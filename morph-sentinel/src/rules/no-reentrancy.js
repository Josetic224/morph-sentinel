module.exports = {
    rule: 'no-reentrancy',
    meta: {
        severity: 'error',
        description: 'Possible re-entrancy vulnerability detected.',
    },
    create: function(context) {
        let funcState = null;

        function checkForReentrancy(node) {
            if (!funcState || !funcState.hasExternalCall) return;

            context.report({
                node: node,
                message: 'State is modified after an external call, which can lead to re-entrancy vulnerabilities.',
            });
            // Report only once per function to avoid spamming.
            funcState.hasExternalCall = false;
        }

        return {
            FunctionDefinition(node) {
                funcState = { hasExternalCall: false };
            },
            'FunctionDefinition:exit'(node) {
                funcState = null;
            },
            FunctionCall(node) {
                if (!funcState) return;
                let expression = node.expression;
                // Handle calls with {value: ...} syntax, which are wrapped
                if (expression.type === 'NameValueExpression') {
                    expression = expression.expression;
                }

                if (
                    expression.type === 'MemberAccess' &&
                    ['call', 'send', 'transfer'].includes(expression.memberName)
                ) {
                    funcState.hasExternalCall = true;
                }
            },
            BinaryOperation(node) {
                const assignmentOperators = ['=', '+=', '-='];
                if (assignmentOperators.includes(node.operator)) {
                    checkForReentrancy(node);
                }
            },
        };
    },
};
