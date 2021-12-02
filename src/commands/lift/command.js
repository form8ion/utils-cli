import {lift} from '@form8ion/lift';
import {
  lift as liftRenovate,
  predicate as renovatePredicate,
  scaffold as scaffoldRenovate
} from '@form8ion/renovate-scaffolder';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import {scaffold as codecovScaffolder} from '@form8ion/codecov';
import {test as jsApplicabilityTest} from '@form8ion/lift-javascript';
import {removeGreenkeeper} from '@form8ion/remove-greenkeeper';
import {lift as liftGithubActionsCI, test as githubActionsCiApplicabilityTest} from '@form8ion/github-actions-node-ci';
import {replace as replaceTravisCiWithGithubActions} from '@form8ion/replace-travis-ci-with-github-actions';
import {javascript as liftJavascript} from './enhanced-lifters';

export function handler({decisions}) {
  return lift({
    decisions,
    scaffolders: {
      Renovate: scaffoldRenovate,
      'Remove Greenkeeper': removeGreenkeeper,
      Cucumber: scaffoldCucumber,
      Codecov: codecovScaffolder,
      'Replace Travis CI with GitHub Actions': replaceTravisCiWithGithubActions
    },
    enhancers: {
      JavaScript: {test: jsApplicabilityTest, lift: liftJavascript},
      Renovate: {test: renovatePredicate, lift: liftRenovate},
      'GitHub Actions CI': {test: githubActionsCiApplicabilityTest, lift: liftGithubActionsCI}
    }
  });
}

export const command = 'lift';
export const describe = 'Lift an existing project with additional functionality';
