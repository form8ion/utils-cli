import {getPrompt, logger} from '@form8ion/cli-core';
import {octokit} from '@form8ion/github-core';
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

export function githubPluginFactory(decisions) {
  const octokitInstance = octokit.getNetrcAuthenticatedInstance();
  const dependencies = {octokit: octokitInstance, prompt: getPrompt(decisions), logger};

  return {
    ...githubPlugin,
    scaffold: githubScaffolderFactory(dependencies),
    lift: enhanceGithubLifter(dependencies)
  };
}
