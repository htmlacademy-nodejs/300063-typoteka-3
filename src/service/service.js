'use strict';

const {Cli} = require(`./cli`);
const {ExitCode, USER_ARGV_INDEX} = require(`./constants`);
const chalk = require(`chalk`);

const userInputList = process.argv.slice(USER_ARGV_INDEX);

const formAnArrayOfCommands = () => {
  return userInputList.reduce((commandList, userInput) => {
    const hasCliCommand = Cli.hasOwnProperty(userInput);
    if (hasCliCommand) {
      commandList.push({
        name: userInput,
        arguments: [],
      });
    } else if (commandList.length) {
      const lastCommandListItem = commandList.pop();
      lastCommandListItem.arguments.push(userInput);
      commandList = [...commandList, lastCommandListItem];
    } else {
      console.error(chalk.red(`Команды ${userInput} не существует`));
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
