#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');
const path = require('path');
const { lint } = require('./linter');

yargs(hideBin(process.argv))
    .command(
        '$0 <file>',
        'Lint a Solidity file',
        (yargs) => {
            return yargs
                .positional('file', {
                    describe: 'Path to the Solidity file to lint',
                    type: 'string',
                })
                .option('format', {
                    describe: 'Output format',
                    alias: 'f',
                    type: 'string',
                    choices: ['stylish', 'json'],
                    default: 'stylish',
                });
        },
        (argv) => {
            const filePath = path.resolve(argv.file);
            if (!fs.existsSync(filePath)) {
                console.error(`Error: File not found at ${filePath}`);
                process.exit(1);
            }

            const sourceCode = fs.readFileSync(filePath, 'utf8');
            const issues = lint(sourceCode);

            try {
                const formatter = require(`./formatters/${argv.format}`);
                formatter(issues, filePath, sourceCode);

                if (issues.length > 0) {
                    process.exit(1);
                }
            } catch (e) {
                console.error(`Error: Formatter '${argv.format}' not found.`);
                process.exit(1);
            }
        }
    )
    .demandCommand(1, 'You need to provide a file to lint.')
    .help()
    .argv;
