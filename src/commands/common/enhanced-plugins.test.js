import * as javascriptPlugin from '@form8ion/javascript';
import * as githubPlugin from '@form8ion/github';

import any from '@travi/any';
import {when} from 'jest-when';
import {describe, vi, it, expect} from 'vitest';

import {javascriptScaffolderFactory, githubScaffolderFactory} from '../scaffold/enhanced-scaffolders.js';
import {javascript as enhancedLiftJavascript, github as enhanceGithubLifter} from '../lift/enhanced-lifters.js';
import {javascriptPluginFactory, githubPluginFactory} from './enhanced-plugins.js';

vi.mock('../scaffold/enhanced-scaffolders.js');
vi.mock('../lift/enhanced-lifters.js');

describe('enhanced plugins', () => {
  it('should pass the custom properties along with the provided options to the js plugin', async () => {
    const decisions = any.simpleObject();
    const enhancedScaffolder = () => undefined;
    when(javascriptScaffolderFactory).calledWith(decisions).mockReturnValue(enhancedScaffolder);

    expect(javascriptPluginFactory(decisions))
      // eslint-disable-next-line prefer-object-spread
      .toEqual(Object.assign({}, javascriptPlugin, {scaffold: enhancedScaffolder, lift: enhancedLiftJavascript}));
  });

  it('should inject an octokit instance into the github plugin', async () => {
    const enhancedScaffolder = () => undefined;
    const enhancedLifter = () => undefined;
    when(githubScaffolderFactory).calledWith().mockReturnValue(enhancedScaffolder);
    when(enhanceGithubLifter).calledWith().mockReturnValue(enhancedLifter);

    // eslint-disable-next-line prefer-object-spread
    expect(githubPluginFactory()).toEqual(Object.assign(
      {},
      githubPlugin,
      {scaffold: enhancedScaffolder, lift: enhancedLifter}
    ));
  });
});
