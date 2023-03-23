import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import updateNotifier from 'update-notifier';

import pkg from '../package.json';
import cli from './cli.js';

cli(yargs(hideBin(process.argv)));

updateNotifier({pkg}).notify();
