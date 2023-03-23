import * as scaffoldCommand from './commands/scaffold/index.js';
import * as liftCommand from './commands/lift/index.js';

export default function (yargs) {
  return yargs
    .scriptName('form8ion-utils')
    .usage('Usage: $0 <cmd> [args]')
    .command(scaffoldCommand)
    .command(liftCommand)
    .demandCommand(1, 'You need at least one command before moving on')
    .help('h')
    .alias('h', 'help')
    .argv;
}
