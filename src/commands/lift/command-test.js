import * as lifter from '@form8ion/lift';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import {test as jsApplicabilityTest, lift as liftJavascript} from '@form8ion/lift-javascript';
import {removeGreenkeeper} from '@form8ion/remove-greenkeeper';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
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
    lifter.lift
      .withArgs({
        scaffolders: {
          Renovate: scaffoldRenovate,
          'Remove Greenkeeper': removeGreenkeeper,
          Cucumber: scaffoldCucumber
        },
        enhancers: {JavaScript: {test: jsApplicabilityTest, lift: liftJavascript}}
      })
      .resolves(liftingResults);

    assert.equal(await handler(), liftingResults);
    assert.equal(command, 'lift');
    assert.equal(describe, 'Lift an existing project with additional functionality');
  });
});
