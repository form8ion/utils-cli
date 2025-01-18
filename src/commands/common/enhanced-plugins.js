import * as javascriptPlugin from '@form8ion/javascript';

import {javascriptScaffolderFactory} from '../scaffold/enhanced-scaffolders.js';
import {javascript as enhancedLiftJavascript} from '../lift/enhanced-lifters.js';

export function javascriptPluginFactory(decisions) {
  return {
    ...javascriptPlugin,
    scaffold: javascriptScaffolderFactory(decisions),
    lift: enhancedLiftJavascript
  };
}
