import * as td from 'testdouble';
import {assert} from 'chai';
import any from '@travi/any';

suite('travis-tokens command', () => {
  let tokenUpdater, command, describe, handler;

  setup(async () => {
    tokenUpdater = await td.replaceEsm('travis-token-updater');

    ({command, describe, handler} = await import('./travis-tokens.js'));
  });

  teardown(() => td.reset());

  test('that the travis-tokens command is defined', async () => {
    const tokenUpdateResults = any.simpleObject();
    td.when(tokenUpdater.update({githubAccount: 'form8ion'})).thenResolve(tokenUpdateResults);

    assert.equal(await handler(), tokenUpdateResults);
    assert.equal(command, 'travis-tokens');
    assert.equal(describe, 'Roll token for Travis projects throughout the organization');
  });
});
