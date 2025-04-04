import * as javascriptPlugin from '@form8ion/javascript';
import * as githubPlugin from '@form8ion/github';

import {javascriptScaffolderFactory, githubScaffolderFactory} from '../scaffold/enhanced-scaffolders.js';
import {javascript as enhancedLiftJavascript, github as enhanceGithubLifter} from '../lift/enhanced-lifters.js';

export function javascriptPluginFactory(decisions) {
  return {
    ...javascriptPlugin,
    scaffold: javascriptScaffolderFactory(decisions),
    lift: enhancedLiftJavascript
  };
}

export function githubPluginFactory() {
  return {
    ...githubPlugin,
    scaffold: githubScaffolderFactory(),
    lift: enhanceGithubLifter()
  };
}
