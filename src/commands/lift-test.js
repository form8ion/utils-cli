import * as lifter from '@form8ion/lift';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import {command, describe, handler} from './lift';

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
      .withArgs({Renovate: scaffoldRenovate})
      .resolves(liftingResults);

    assert.equal(await handler(), liftingResults);
    assert.equal(command, 'lift');
    assert.equal(describe, 'Lift an existing project with additional functionality');
  });
});
