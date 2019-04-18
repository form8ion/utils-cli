import * as scaffoldCommand from './commands/scaffold';

export default function (yargs) {
  return yargs
    .scriptName('form8ion-utils')
    .usage('Usage: $0 <cmd> [args]')
    .command(scaffoldCommand)
    .demandCommand(1, 'You need at least one command before moving on')
    .help('h')
    .alias('h', 'help')
    .argv;
}
