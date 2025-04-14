import {getPrompt, logger} from '@form8ion/cli-core';
import {octokit} from '@form8ion/github-core';
import * as javascriptPlugin from '@form8ion/javascript';
import * as githubPlugin from '@form8ion/github';

import any from '@travi/any';
import {when} from 'vitest-when';
import {describe, vi, it, expect} from 'vitest';

import {javascriptScaffolderFactory, githubScaffolderFactory} from '../scaffold/enhanced-scaffolders.js';
import {javascript as enhancedLiftJavascript, github as enhanceGithubLifter} from '../lift/enhanced-lifters.js';
import {javascriptPluginFactory, githubPluginFactory} from './enhanced-plugins.js';

vi.mock('@form8ion/cli-core');
vi.mock('@form8ion/github-core');
vi.mock('../scaffold/enhanced-scaffolders.js');
vi.mock('../lift/enhanced-lifters.js');

describe('enhanced plugins', () => {
  it('should pass the custom properties along with the provided options to the js plugin', async () => {
    const decisions = any.simpleObject();
    const enhancedScaffolder = () => undefined;
    when(javascriptScaffolderFactory).calledWith(decisions).thenReturn(enhancedScaffolder);

    expect(javascriptPluginFactory(decisions))
      // eslint-disable-next-line prefer-object-spread
      .toEqual(Object.assign({}, javascriptPlugin, {scaffold: enhancedScaffolder, lift: enhancedLiftJavascript}));
  });

  it('should inject dependencies into the github plugin', async () => {
    const enhancedScaffolder = () => undefined;
    const enhancedLifter = () => undefined;
    const octokitInstance = any.simpleObject();
    const decisions = any.simpleObject();
    const prompt = () => undefined;
    when(octokit.getNetrcAuthenticatedInstance).calledWith().thenReturn(octokitInstance);
    when(getPrompt).calledWith(decisions).thenReturn(prompt);
    when(githubScaffolderFactory)
      .calledWith({octokit: octokitInstance, prompt, logger})
      .thenReturn(enhancedScaffolder);
    when(enhanceGithubLifter).calledWith({octokit: octokitInstance, prompt, logger}).thenReturn(enhancedLifter);

    // eslint-disable-next-line prefer-object-spread
    expect(githubPluginFactory(decisions)).toEqual(Object.assign(
      {},
      githubPlugin,
      {scaffold: enhancedScaffolder, lift: enhancedLifter}
    ));
  });
});
