module.exports = {
    rule: 'no-floating-pragma',
    meta: {
        severity: 'warning',
        description: 'Pragma should be locked to a specific Solidity version.',
    },
    create: function(context) {
        return {
            PragmaDirective: function(node) {
                if (node.value.includes('^')) {
                    context.report({
                        node: node,
                        message: `Avoid using floating pragma "^". Lock the version (e.g., "0.8.20").`,
                    });
                }
            }
        };
    }
};
