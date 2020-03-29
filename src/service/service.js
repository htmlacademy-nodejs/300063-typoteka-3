'use strict';

const {Cli} = require(`./cli`);
const {ExitCode, USER_ARGV_INDEX} = require(`./constants`);
const chalk = require(`chalk`);


const userInputList = process.argv.slice(USER_ARGV_INDEX);

let userCommand;
let userParam;

const runCheckedUserCommand = () => {
  if (userCommand && userParam) {
    Cli[userCommand].run(userParam);
  } else if (userCommand) {
    Cli[userCommand].run();
  } else if (userParam) {
    console.error(chalk.red(`Error exist command. '${userParam}' command doesn't exist!`));
    process.exit(ExitCode.ERROR);
  }
  userCommand = null;
  userParam = null;
};

const runUserCommands = () => {
  for (let userInput of userInputList) {
    if (Cli.hasOwnProperty(userInput)) {
      userCommand = userInput;
      continue;
    }
    userParam = userInput;
    runCheckedUserCommand();
  }
  runCheckedUserCommand();
};

runUserCommands();
