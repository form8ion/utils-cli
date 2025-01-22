import {ungroupObject} from '@form8ion/core';
import {lift} from '@form8ion/javascript';
import {scaffold as codecovScaffolder} from '@form8ion/codecov';
import {scaffold as scaffoldPrettier} from '@form8ion/prettier';

import getJavascriptPlugins from '../common/javascript-plugins.js';
import {javascriptConfigs} from '../common/javascript-configs.js';

export function javascript(options) {
  return lift({...options, configs: javascriptConfigs, enhancers: ungroupObject(getJavascriptPlugins({}))});
}

export function getEnhancedCodecovScaffolder() {
  return options => codecovScaffolder({...options, visibility: 'Public'});
}

export function prettier(options) {
  return scaffoldPrettier({...options, config: javascriptConfigs.prettier});
}
