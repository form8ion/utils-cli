import {lift} from '@form8ion/lift';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import {test as jsApplicabilityTest, lift as liftJavascript} from '@form8ion/lift-javascript';
import {removeGreenkeeper} from '@form8ion/remove-greenkeeper';

export function handler() {
  return lift({
    scaffolders: {
      Renovate: scaffoldRenovate,
      'Remove Greenkeeper': removeGreenkeeper,
      Cucumber: scaffoldCucumber
    },
    enhancers: {JavaScript: {test: jsApplicabilityTest, lift: liftJavascript}}
  });
}

export const command = 'lift';
export const describe = 'Lift an existing project with additional functionality';
