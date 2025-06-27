module.exports = {
    rule: 'no-delegatecall-in-loop',
    meta: {
        severity: 'error',
        description: 'Using delegatecall inside a loop is extremely dangerous and can lead to unexpected behavior.',
    },
    create: function(context) {
        function isInsideLoop(node) {
            let currentNode = node.parent;
            while (currentNode) {
                if (['ForStatement', 'WhileStatement', 'DoWhileStatement'].includes(currentNode.type)) {
                    return true;
                }
                currentNode = currentNode.parent;
            }
            return false;
        }

        return {
            FunctionCall(node) {
                let expression = node.expression;
                if (expression.type === 'NameValueExpression') {
                    expression = expression.expression;
                }

                if (
                    expression.type === 'MemberAccess' &&
                    expression.memberName === 'delegatecall'
                ) {
                    if (isInsideLoop(node)) {
                        context.report({
                            node: node,
                            message: 'Avoid using delegatecall inside a loop.',
                        });
                    }
                }
            },
        };
    },
};
