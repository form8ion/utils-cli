import {ungroupObject} from '@form8ion/core';
import {lift as liftJs} from '@form8ion/javascript';
import {scaffold as scaffoldCodecov} from '@form8ion/codecov';
import {lift as liftGithub} from '@form8ion/github';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import getJavascriptPlugins from '../common/javascript-plugins.js';
import {getEnhancedCodecovScaffolder, github, javascript} from './enhanced-lifters.js';

vi.mock('@form8ion/core');
vi.mock('@form8ion/javascript');
vi.mock('@form8ion/codecov');
vi.mock('@form8ion/github');
vi.mock('../common/javascript-plugins.js');

describe('enhanced lifters', () => {
  const options = any.simpleObject();
  const results = any.simpleObject();
  const packageScope = '@form8ion';

  it('should pass the custom properties along with the provided options to the js lifter', async () => {
    const pluginGroups = any.objectWithKeys(any.listOf(any.word), {factory: any.simpleObject});
    const ungroupedPlugins = any.simpleObject();
    when(getJavascriptPlugins).calledWith({}).mockReturnValue(pluginGroups);
    when(ungroupObject).calledWith(pluginGroups).mockReturnValue(ungroupedPlugins);
    when(liftJs).calledWith({
      ...options,
      configs: {
        eslint: {scope: packageScope},
        remark: `${packageScope}/remark-lint-preset`,
        babelPreset: {
          name: packageScope,
          packageName: `${packageScope}/babel-preset`
        },
        typescript: {scope: packageScope},
        commitlint: {
          name: packageScope,
          packageName: `${packageScope}/commitlint-config`
        }
      },
      enhancers: ungroupedPlugins
    }).mockResolvedValue(results);

    expect(await javascript(options)).toEqual(results);
  });

  it('should set the visibility to `Public` for Codecov since all projects in this org are public', async () => {
    when(scaffoldCodecov).calledWith({...options, visibility: 'Public'}).mockResolvedValue(results);

    expect(await getEnhancedCodecovScaffolder()(options)).toEqual(results);
  });

  it('should pass the octokit instance as a dependency to the github lifter', async () => {
    const octokitInstance = any.simpleObject();
    when(liftGithub).calledWith(options, {octokit: octokitInstance}).mockResolvedValue(results);

    expect(await github(octokitInstance)(options)).toEqual(results);
  });
});
