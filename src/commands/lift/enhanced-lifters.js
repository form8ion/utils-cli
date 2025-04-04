import {ungroupObject} from '@form8ion/core';
import {octokit} from '@form8ion/github-core';
import {lift as liftJavascript} from '@form8ion/javascript';
import {scaffold as codecovScaffolder} from '@form8ion/codecov';
import {scaffold as scaffoldPrettier} from '@form8ion/prettier';
import {lift as liftGithub} from '@form8ion/github';

import getJavascriptPlugins from '../common/javascript-plugins.js';
import {javascriptConfigs} from '../common/javascript-configs.js';

export function javascript(options) {
  return liftJavascript({...options, configs: javascriptConfigs, enhancers: ungroupObject(getJavascriptPlugins({}))});
}

export function getEnhancedCodecovScaffolder() {
  return options => codecovScaffolder({...options, visibility: 'Public'});
}

export function prettier(options) {
  return scaffoldPrettier({...options, config: javascriptConfigs.prettier});
}

export function github() {
  const octokitInstance = octokit.getNetrcAuthenticatedInstance();

  return options => liftGithub(options, {octokit: octokitInstance});
}
