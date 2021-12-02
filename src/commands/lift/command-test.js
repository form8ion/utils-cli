import * as lifter from '@form8ion/lift';
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
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import {javascript as liftJavascript} from './enhanced-lifters';
import {command, describe, handler} from '.';

suite('lift command', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(lifter, 'lift');
  });

  teardown(() => sandbox.restore());

  test('that the lift command is defined', async () => {
    const liftingResults = any.simpleObject();
    const decisions = any.simpleObject();
    lifter.lift
      .withArgs({
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
      })
      .resolves(liftingResults);

    assert.equal(await handler({decisions}), liftingResults);
    assert.equal(command, 'lift');
    assert.equal(describe, 'Lift an existing project with additional functionality');
  });
});
