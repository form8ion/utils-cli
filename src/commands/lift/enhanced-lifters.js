import {ungroupObject} from '@form8ion/core';
import {lift as liftJavascript, test as testJavascript} from '@form8ion/javascript';
import {scaffold as scaffoldPrettier} from '@form8ion/prettier';

import getJavascriptPlugins from '../common/javascript-plugins.js';
import {javascriptConfigs} from '../common/javascript-configs.js';

export function javascriptTesterFactory(dependencies) {
  return options => testJavascript(options, dependencies);
}

export function javascriptLifterFactory(dependencies) {
  return options => liftJavascript({
    ...options,
    configs: javascriptConfigs,
    enhancers: ungroupObject(getJavascriptPlugins({}))
  }, dependencies);
}

export function prettier(options) {
  return scaffoldPrettier({...options, config: javascriptConfigs.prettier});
}
