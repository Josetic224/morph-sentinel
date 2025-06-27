module.exports = {
    rule: 'no-self-destruct',
    meta: {
        severity: 'warning',
        description: 'Use of selfdestruct is deprecated and can be dangerous.',
    },
    create: function(context) {
        return {
            FunctionCall(node) {
                if (node.expression.type === 'Identifier' && node.expression.name === 'selfdestruct') {
                    context.report({
                        node: node,
                        message: 'Use of selfdestruct is deprecated. Consider implementing a withdrawal pattern instead.',
                    });
                }
            },
        };
    },
};
