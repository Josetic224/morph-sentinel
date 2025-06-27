module.exports = {
    rule: 'no-unchecked-call-return',
    meta: {
        severity: 'warning',
        description: 'The return value of a low-level call is not checked.',
    },
    create: function(context) {
        return {
            FunctionCall(node) {
                let expression = node.expression;
                if (expression.type === 'NameValueExpression') {
                    expression = expression.expression;
                }

                if (
                    expression.type === 'MemberAccess' &&
                    ['call', 'send', 'transfer', 'delegatecall', 'staticcall'].includes(expression.memberName)
                ) {
                    // If the parent is an ExpressionStatement, it means the return value is not being used.
                    if (node.parent && node.parent.type === 'ExpressionStatement') {
                        context.report({
                            node: node,
                            message: `The return value of the low-level call to "${expression.memberName}" should be checked.`,
                        });
                    }
                }
            },
        };
    },
};
