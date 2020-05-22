'use strict';

const chalk = require(`chalk`);

const {Cli} = require(`backend/cli`);
const {params} = require(`common`);


const userInputList = process.argv.slice(params.DEFAULT_USER_ARGV_INDEX);

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
      process.exit(params.ExitCodes.ERROR);
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
      console.error(chalk.red(`Commands need start with "--" or "-"`));
      process.exit(params.ExitCodes.ERROR);
    }
    return commandList;
  }, []);
};

const runUserCommands = () => {
  const commandList = formAnArrayOfCommands();
  commandList.forEach((command) => Cli[command.name].run(...command.arguments));
  if (commandList.length === 0) {
    Cli[params.DEFAULT_COMMAND_FOR_BACKEND_CLI].run();
  }
};

runUserCommands();
