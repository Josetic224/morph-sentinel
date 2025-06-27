module.exports = function(issues, filePath, sourceCode) {
    const lines = sourceCode.split('\n');

    if (issues.length > 0) {
        console.log(`\nFound ${issues.length} issue(s) in ${filePath}:\n`);
        issues.forEach(issue => {
            const lineContent = lines[issue.line - 1];
            console.log(`  ${issue.line}:${issue.column}\t${issue.severity}\t${issue.message}\t(${issue.rule})`);
            console.log(``);
            console.log(`    ${issue.line} | ${lineContent}`);
            console.log(`      | ${' '.repeat(issue.column)}${'^'}`);
            console.log(``);
        });
    } else {
        console.log(`\nNo issues found in ${filePath}. Well done! ✨\n`);
    }
};
