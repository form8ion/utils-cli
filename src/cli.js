export default function (yargs) {
  return yargs
    .scriptName('form8ion-utils')
    .usage('Usage: $0 <cmd> [args]')
    .help('h')
    .alias('h', 'help')
    .argv;
}
