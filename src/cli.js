import arg from 'arg';
import inquirer from 'inquirer';

import TEMPLATES from './templates.js';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install',
    },
    {
      argv: rawArgs.slice(2), // skip first two rawArgs which are the bin paths of node and this command
    }
  );

  return {
    template: args._[0],
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    runInstall: args['--install'] || false,
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = 'JavaScript';

  if (options.skipPrompts) {
    return { ...options, template: options.template || defaultTemplate };
  }

  const questions = [];
  if (!options.template) {
    questions.push({ name: 'template', type: 'list', message: 'Select project template', choices: TEMPLATES, default: defaultTemplate });
  }

  if (!options.git) {
    questions.push({ name: 'git', type: 'confirm', message: 'Initialize git repo?', default: false });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  console.log(options);
}
