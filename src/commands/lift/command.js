import {ungroupObject} from '@form8ion/core';
import {lift} from '@form8ion/lift';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import {removeGreenkeeper} from '@form8ion/remove-greenkeeper';
import {replace as replaceTravisCiWithGithubActions} from '@form8ion/replace-travis-ci-with-github-actions';
import {scaffold as scaffoldOssfScorecard} from '@form8ion/ossf-scorecard';
import {lift as liftJetbrains, test as jetbrainsInUse} from '@form8ion/jetbrains';

import projectPlugins from '../common/plugins.js';
import {prettier} from './enhanced-lifters.js';
import {getEnhancedCodecovScaffolder, unitTesting} from './enhanced-scaffolders.js';

export function handler({decisions}) {
  return lift({
    decisions,
    scaffolders: {
      Renovate: scaffoldRenovate,
      'Unit Testing': unitTesting,
      Cucumber: scaffoldCucumber,
      Codecov: getEnhancedCodecovScaffolder(),
      Prettier: prettier,
      'Remove Greenkeeper': removeGreenkeeper,
      'Replace Travis CI with GitHub Actions': replaceTravisCiWithGithubActions,
      'OSSF Scorecard': scaffoldOssfScorecard
    },
    enhancers: {
      ...ungroupObject(projectPlugins({})),
      JetBrains: {test: jetbrainsInUse, lift: liftJetbrains}
    }
  });
}

export const command = 'lift';
export const describe = 'Lift an existing project with additional functionality';
