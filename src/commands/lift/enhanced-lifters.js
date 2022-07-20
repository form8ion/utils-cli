import {lift} from '@form8ion/javascript';
import {scaffold as codecovScaffolder} from '@form8ion/codecov';

import {javascriptConfigs} from '../common.js';

export function javascript(options) {
  return lift({...options, configs: javascriptConfigs});
}

export function getEnhancedCodecovScaffolder() {
  return options => codecovScaffolder({...options, visibility: 'Public'});
}
