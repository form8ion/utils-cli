import {lift} from '@form8ion/lift-javascript';
import {scaffold as codecovScaffolder} from '@form8ion/codecov';

import {javascriptConfigs} from '../common';

export function javascript(options) {
  return lift({...options, configs: javascriptConfigs});
}

export function getEnhancedCodecovScaffolder() {
  return options => codecovScaffolder({...options, visibility: 'Public'});
}
