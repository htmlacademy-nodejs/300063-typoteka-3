'use strict';

const chalk = require(`chalk`);

const {Cli} = require(`service/cli`);
const {ExitCode, USER_ARGV_INDEX} = require(`service/constants`);


const userInputList = process.argv.slice(USER_ARGV_INDEX);

const checkToBeCommandOrAlias = (userInput) => {
  const isCommand = userInput.search(`--`) === 0;
  const isAlias = !parseInt(userInput, 10) && userInput.search(`-`) === 0;
  return isCommand || isAlias;
};

const formAnArrayOfCommands = () => {
  return userInputList.reduce((commandList, userInput) => {
    const hasCliCommand = Cli.hasOwnProperty(userInput);
    const isCommandOrAlias = checkToBeCommandOrAlias(userInput);

    if (!hasCliCommand && isCommandOrAlias) {
      console.error(chalk.red(`Command ${userInput} doesn't exist`));
      process.exit(ExitCode.ERROR);
    } else if (hasCliCommand) {
      commandList.push({
        name: userInput,
        arguments: [],
      });
    } else if (commandList.length) {
      const lastCommandListItem = commandList.pop();
      lastCommandListItem.arguments.push(userInput);
      commandList = [...commandList, lastCommandListItem];
    } else {
      console.log(chalk.red(`Commands need start with "--" or "-"`));
      process.exit(ExitCode.ERROR);
    }
    return commandList;
  }, []);
};

const runUserCommands = () => {
  const commandList = formAnArrayOfCommands();
  commandList.forEach((command) => Cli[command.name].run(...command.arguments));
};

runUserCommands();
