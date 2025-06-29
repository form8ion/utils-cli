import {composeDependenciesInto} from '@form8ion/core';
import {logger} from '@form8ion/cli-core';
import {octokit} from '@form8ion/github-core';
import * as javascriptPlugin from '@form8ion/javascript';
import * as githubPlugin from '@form8ion/github';
import {packageManagers} from '@form8ion/javascript-core';
import {questionNames as jsQuestionNames} from '@form8ion/javascript';

import {javascriptScaffolderFactory} from '../scaffold/enhanced-scaffolders.js';
import {javascript as enhancedLiftJavascript} from '../lift/enhanced-lifters.js';
import {github as githubPrompt} from './prompts.js';

export function javascriptPluginFactory(decisions) {
  const decisionsWithEnhancements = {
    ...decisions,
    [jsQuestionNames.AUTHOR_NAME]: 'Matt Travi',
    [jsQuestionNames.AUTHOR_EMAIL]: 'npm@travi.org',
    [jsQuestionNames.AUTHOR_URL]: 'https://matt.travi.org',
    [jsQuestionNames.SCOPE]: 'form8ion',
    [jsQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM
  };

  return {
    ...javascriptPlugin,
    scaffold: javascriptScaffolderFactory(decisionsWithEnhancements),
    lift: enhancedLiftJavascript
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
