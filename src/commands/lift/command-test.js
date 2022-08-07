import {
  lift as liftRenovate,
  predicate as renovatePredicate,
  scaffold as scaffoldRenovate
} from '@form8ion/renovate-scaffolder';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import {test as jsApplicabilityTest} from '@form8ion/javascript';
import {removeGreenkeeper} from '@form8ion/remove-greenkeeper';
import {lift as liftGithubActionsCI, test as githubActionsCiApplicabilityTest} from '@form8ion/github-actions-node-ci';
import {replace as replaceTravisCiWithGithubActions} from '@form8ion/replace-travis-ci-with-github-actions';

import {assert} from 'chai';
import td from 'testdouble';
import any from '@travi/any';
import {scaffold as scaffoldPrettier} from '@form8ion/prettier';

suite('lift command', () => {
  let lifter, enhancedLifters, command, describe, handler;

  setup(() => {
    lifter = td.replace('@form8ion/lift');
    enhancedLifters = td.replace('./enhanced-lifters');

    ({command, describe, handler} = require('.'));
  });

  teardown(() => td.reset());

  test('that the lift command is defined', async () => {
    const liftingResults = any.simpleObject();
    const decisions = any.simpleObject();
    const codecovScaffolder = () => undefined;
    td.when(enhancedLifters.getEnhancedCodecovScaffolder()).thenReturn(codecovScaffolder);
    td.when(lifter.lift({
      decisions,
      scaffolders: {
        Renovate: scaffoldRenovate,
        Cucumber: scaffoldCucumber,
        Codecov: codecovScaffolder,
        Prettier: scaffoldPrettier,
        'Remove Greenkeeper': removeGreenkeeper,
        'Replace Travis CI with GitHub Actions': replaceTravisCiWithGithubActions
      },
      enhancers: {
        JavaScript: {test: jsApplicabilityTest, lift: enhancedLifters.javascript},
        Renovate: {test: renovatePredicate, lift: liftRenovate},
        'GitHub Actions CI': {test: githubActionsCiApplicabilityTest, lift: liftGithubActionsCI}
      }
    })).thenResolve(liftingResults);

    assert.equal(await handler({decisions}), liftingResults);
    assert.equal(command, 'lift');
    assert.equal(describe, 'Lift an existing project with additional functionality');
  });
});
