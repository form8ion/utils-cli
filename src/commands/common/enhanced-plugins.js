import {composeDependenciesInto} from '@form8ion/core';
import {logger} from '@form8ion/cli-core';
import {octokit} from '@form8ion/github-core';
import * as javascriptPlugin from '@form8ion/javascript';
import * as githubPlugin from '@form8ion/github';

import {javascriptScaffolderFactory} from '../scaffold/enhanced-scaffolders.js';
import {javascriptLifterFactory, javascriptTesterFactory} from '../lift/enhanced-lifters.js';
import {getJavascriptPrompt, github as githubPrompt} from './prompts.js';

export function javascriptPluginFactory(decisions, dependencies) {
  return {
    ...javascriptPlugin,
    test: javascriptTesterFactory(dependencies),
    scaffold: javascriptScaffolderFactory({...dependencies, prompt: getJavascriptPrompt(decisions)}),
    lift: javascriptLifterFactory(dependencies)
  };
}

export function githubPluginFactory() {
  const octokitInstance = octokit.getNetrcAuthenticatedInstance();
  const dependencies = {octokit: octokitInstance, prompt: githubPrompt, logger};

  return {
    ...githubPlugin,
    scaffold: composeDependenciesInto(githubPlugin.scaffold, dependencies),
    lift: composeDependenciesInto(githubPlugin.lift, dependencies)
  };
}
