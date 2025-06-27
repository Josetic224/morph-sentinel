module.exports = {
    rule: 'no-tx-origin',
    meta: {
        severity: 'error',
        description: 'Avoid using tx.origin for authorization.',
    },
    create: function(context) {
        return {
            MemberAccess: function(node) {
                if (node.expression.name === 'tx' && node.memberName === 'origin') {
                    context.report({
                        node: node,
                        message: "Using 'tx.origin' for authorization is insecure. Use 'msg.sender' instead.",
                    });
                }
            }
        };
    }
};
