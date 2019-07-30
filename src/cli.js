import arg from 'arg';

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

export function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  console.log(options);
}
