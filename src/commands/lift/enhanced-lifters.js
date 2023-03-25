import {lift} from '@form8ion/javascript';
import {scaffold as codecovScaffolder} from '@form8ion/codecov';
import {scaffold as scaffoldPrettier} from '@form8ion/prettier';

import {javascriptConfigs} from '../common/javascript-configs.js';

export function javascript(options) {
  return lift({...options, configs: javascriptConfigs});
}

export function getEnhancedCodecovScaffolder() {
  return options => codecovScaffolder({...options, visibility: 'Public'});
}

export function prettier(options) {
  return scaffoldPrettier({...options, config: javascriptConfigs.prettier});
}
