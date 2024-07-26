import {lift} from '@form8ion/lift';
import {
  lift as liftRenovate,
  test as renovatePredicate,
  scaffold as scaffoldRenovate
} from '@form8ion/renovate-scaffolder';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import {test as jsApplicabilityTest} from '@form8ion/javascript';
import {removeGreenkeeper} from '@form8ion/remove-greenkeeper';
import {lift as liftGithubActionsCI, test as githubActionsCiApplicabilityTest} from '@form8ion/github-actions-node-ci';
import {replace as replaceTravisCiWithGithubActions} from '@form8ion/replace-travis-ci-with-github-actions';
import {scaffold as scaffoldOssfScorecard} from '@form8ion/ossf-scorecard';
import {lift as liftJetbrains, test as jetbrainsInUse} from '@form8ion/jetbrains';

import {getEnhancedCodecovScaffolder, javascript as liftJavascript, prettier} from './enhanced-lifters.js';
import {unitTesting} from './enhanced-scaffolders.js';

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
      JavaScript: {test: jsApplicabilityTest, lift: liftJavascript},
      Renovate: {test: renovatePredicate, lift: liftRenovate},
      'GitHub Actions CI': {test: githubActionsCiApplicabilityTest, lift: liftGithubActionsCI},
      JetBrains: {test: jetbrainsInUse, lift: liftJetbrains}
    }
  });
}

export const command = 'lift';
export const describe = 'Lift an existing project with additional functionality';
