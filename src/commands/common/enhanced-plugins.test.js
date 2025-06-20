import {composeDependenciesInto} from '@form8ion/core';
import {logger} from '@form8ion/cli-core';
import {octokit} from '@form8ion/github-core';
import * as githubPlugin from '@form8ion/github';
import {packageManagers} from '@form8ion/javascript-core';
import * as javascriptPlugin from '@form8ion/javascript';
import {questionNames as jsQuestionNames} from '@form8ion/javascript';

import any from '@travi/any';
import {when} from 'vitest-when';
import {describe, expect, it, vi} from 'vitest';

import {javascriptScaffolderFactory} from '../scaffold/enhanced-scaffolders.js';
import {javascript as enhancedLiftJavascript} from '../lift/enhanced-lifters.js';
import {github as githubPrompt} from './prompts.js';
import {githubPluginFactory, javascriptPluginFactory} from './enhanced-plugins.js';

vi.mock('@form8ion/core');
vi.mock('@form8ion/cli-core');
vi.mock('@form8ion/github-core');
vi.mock('../scaffold/enhanced-scaffolders.js');
vi.mock('../lift/enhanced-lifters.js');

describe('enhanced plugins', () => {
  it('should pass the custom properties along with the provided options to the js plugin', async () => {
    const decisions = any.simpleObject();
    const enhancedScaffolder = () => undefined;
    when(javascriptScaffolderFactory)
      .calledWith({
        ...decisions,
        [jsQuestionNames.AUTHOR_NAME]: 'Matt Travi',
        [jsQuestionNames.AUTHOR_EMAIL]: 'npm@travi.org',
        [jsQuestionNames.AUTHOR_URL]: 'https://matt.travi.org',
        [jsQuestionNames.SCOPE]: 'form8ion',
        [jsQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM
      })
      .thenReturn(enhancedScaffolder);

    expect(javascriptPluginFactory(decisions))
      // eslint-disable-next-line prefer-object-spread
      .toEqual(Object.assign({}, javascriptPlugin, {scaffold: enhancedScaffolder, lift: enhancedLiftJavascript}));
  });

  it('should inject dependencies into the github plugin', async () => {
    const enhancedScaffolder = () => undefined;
    const enhancedLifter = () => undefined;
    const octokitInstance = any.simpleObject();
    const decisions = any.simpleObject();
    const dependencies = {octokit: octokitInstance, prompt: githubPrompt, logger};
    when(octokit.getNetrcAuthenticatedInstance).calledWith().thenReturn(octokitInstance);
    when(composeDependenciesInto).calledWith(githubPlugin.scaffold, dependencies).thenReturn(enhancedScaffolder);
    when(composeDependenciesInto).calledWith(githubPlugin.lift, dependencies).thenReturn(enhancedLifter);

    // eslint-disable-next-line prefer-object-spread
    expect(githubPluginFactory(decisions)).toEqual(Object.assign(
      {},
      githubPlugin,
      {scaffold: enhancedScaffolder, lift: enhancedLifter}
    ));
  });
});
