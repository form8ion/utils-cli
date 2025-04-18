import {ungroupObject} from '@form8ion/core';
import * as lifter from '@form8ion/lift';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import {removeGreenkeeper} from '@form8ion/remove-greenkeeper';
import {replace as replaceTravisCiWithGithubActions} from '@form8ion/replace-travis-ci-with-github-actions';
import {scaffold as scaffoldOssfScorecard} from '@form8ion/ossf-scorecard';
import {lift as liftJetbrains, test as jetbrainsInUse} from '@form8ion/jetbrains';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import projectPlugins from '../common/plugins.js';
import {getEnhancedCodecovScaffolder, unitTesting} from './enhanced-scaffolders.js';
import * as enhancedLifters from './enhanced-lifters.js';
import {command, describe as commandDescription, handler} from './index.js';

vi.mock('@form8ion/core');
vi.mock('@form8ion/lift');
vi.mock('../common/plugins.js');
vi.mock('./enhanced-lifters.js');
vi.mock('./enhanced-scaffolders.js');

describe('lift command', () => {
  it('should define the lift command', async () => {
    const liftingResults = any.simpleObject();
    const decisions = any.simpleObject();
    const projectPluginGroups = any.objectWithKeys(any.listOf(any.word), {factory: any.simpleObject});
    const codecovScaffolder = () => undefined;
    const ungroupedPlugins = any.simpleObject();
    when(ungroupObject).calledWith(projectPluginGroups).thenReturn(ungroupedPlugins);
    getEnhancedCodecovScaffolder.mockReturnValue(codecovScaffolder);
    when(projectPlugins).calledWith({}).thenReturn(projectPluginGroups);
    when(lifter.lift)
      .calledWith({
        decisions,
        scaffolders: {
          Renovate: scaffoldRenovate,
          'Unit Testing': unitTesting,
          Cucumber: scaffoldCucumber,
          Codecov: codecovScaffolder,
          Prettier: enhancedLifters.prettier,
          'Remove Greenkeeper': removeGreenkeeper,
          'Replace Travis CI with GitHub Actions': replaceTravisCiWithGithubActions,
          'OSSF Scorecard': scaffoldOssfScorecard
        },
        enhancers: {
          ...ungroupedPlugins,
          JetBrains: {test: jetbrainsInUse, lift: liftJetbrains}
        }
      })
      .thenResolve(liftingResults);

    expect(await handler({decisions})).toEqual(liftingResults);
    expect(command).toEqual('lift');
    expect(commandDescription).toEqual('Lift an existing project with additional functionality');
  });
});
