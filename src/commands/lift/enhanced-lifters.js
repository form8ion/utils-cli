import {ungroupObject} from '@form8ion/core';
import {lift as liftJavascript} from '@form8ion/javascript';
import {scaffold as scaffoldPrettier} from '@form8ion/prettier';

import getJavascriptPlugins from '../common/javascript-plugins.js';
import {javascriptConfigs} from '../common/javascript-configs.js';

export function javascript(options) {
  return liftJavascript({...options, configs: javascriptConfigs, enhancers: ungroupObject(getJavascriptPlugins({}))});
}

export function prettier(options) {
  return scaffoldPrettier({...options, config: javascriptConfigs.prettier});
}
