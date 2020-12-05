import {lift} from '@form8ion/lift';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import {test as jsApplicabilityTest} from '@form8ion/lift-javascript';
import {removeGreenkeeper} from '@form8ion/remove-greenkeeper';
import {replace as replaceTravisCiWithGithubActions} from '@form8ion/replace-travis-ci-with-github-actions';
import {javascript as liftJavascript} from './enhanced-lifters';

export function handler() {
  return lift({
    scaffolders: {
      Renovate: scaffoldRenovate,
      'Remove Greenkeeper': removeGreenkeeper,
      Cucumber: scaffoldCucumber,
      'Replace Travis CI with GitHub Actions': replaceTravisCiWithGithubActions
    },
    enhancers: {JavaScript: {test: jsApplicabilityTest, lift: liftJavascript}}
  });
}

export const command = 'lift';
export const describe = 'Lift an existing project with additional functionality';
