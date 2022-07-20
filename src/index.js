import yargs from 'yargs';
import updateNotifier from 'update-notifier';
import pkg from '../package.json';
import cli from './cli.js';

cli(yargs);

updateNotifier({pkg}).notify();
