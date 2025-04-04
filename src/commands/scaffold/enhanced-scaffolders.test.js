import {scaffold as scaffoldJavascript} from '@form8ion/javascript';
import {scaffold as scaffoldGithub} from '@form8ion/github';
import {octokit} from '@form8ion/github-core';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';
import {javascriptScaffolderFactory, githubScaffolderFactory} from './enhanced-scaffolders.js';
import getJavascriptPlugins from '../common/javascript-plugins.js';

vi.mock('@form8ion/javascript');
vi.mock('@form8ion/github');
vi.mock('@form8ion/github-core');
vi.mock('@travi/');
vi.mock('../common/javascript-plugins.js');

describe('enhanced scaffolders', () => {
  const output = any.simpleObject();
  const decisions = any.simpleObject();

  it('should pass the custom properties along with the provided options to the js scaffolder', async () => {
    const options = any.simpleObject();
    const packageScope = '@form8ion';
    const pluginGroups = any.objectWithKeys(any.listOf(any.word), {factory: any.simpleObject});
    when(getJavascriptPlugins).calledWith({}).mockReturnValue(pluginGroups);
    when(scaffoldJavascript).calledWith({
      ...options,
      configs: {
        eslint: {scope: packageScope},
        remark: `${packageScope}/remark-lint-preset`,
        babelPreset: {name: packageScope, packageName: `${packageScope}/babel-preset`},
        typescript: {scope: packageScope},
        commitlint: {name: packageScope, packageName: `${packageScope}/commitlint-config`}
      },
      plugins: pluginGroups,
      decisions
    }).mockResolvedValue(output);

    expect(await javascriptScaffolderFactory(decisions)(options)).toEqual(output);
  });

  it('should provide the octokit instance to the github scaffolder', async () => {
    const options = any.simpleObject();
    const dependencies = any.simpleObject();
    const octokitInstance = any.simpleObject();
    when(octokit.getNetrcAuthenticatedInstance).calledWith().mockReturnValue(octokitInstance);
    when(scaffoldGithub).calledWith(options, {...dependencies, octokit: octokitInstance}).mockResolvedValue(output);

    expect(await githubScaffolderFactory()(options, dependencies)).toEqual(output);
  });
});
