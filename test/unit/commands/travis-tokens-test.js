import * as tokenUpdater from 'travis-token-updater';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import {command, describe, handler} from '../../../src/commands/travis-tokens';

suite('travis-tokens command', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(tokenUpdater, 'update');
  });

  teardown(() => sandbox.restore());

  test('that the travis-tokens command is defined', async () => {
    const tokenUpdateResults = any.simpleObject();
    tokenUpdater.update.withArgs({githubAccount: 'form8ion'}).resolves(tokenUpdateResults);

    assert.equal(await handler(), tokenUpdateResults);
    assert.equal(command, 'travis-tokens');
    assert.equal(describe, 'Roll token for Travis projects throughout the organization');
  });
});
