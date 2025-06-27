module.exports = function(issues, filePath) {
    const output = {
        filePath,
        issues,
        issueCount: issues.length,
    };
    console.log(JSON.stringify(output, null, 2));
};
