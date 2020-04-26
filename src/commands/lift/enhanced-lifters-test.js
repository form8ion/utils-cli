import * as jsLifter from '@form8ion/lift-javascript';
import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import {javascript} from './enhanced-lifters';

suite('enhanced lifters', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(jsLifter, 'lift');
  });

  teardown(() => sandbox.restore());

  test('that the custom properties are passed along with the provided options to the js lifter', async () => {
    const options = any.simpleObject();

    await javascript(options);

    assert.calledWith(
      jsLifter.lift,
      {
        ...options,
        configs: {
          eslint: {scope: '@form8ion'},
          remark: '@form8ion/remark-lint-preset',
          babelPreset: {name: '@form8ion', packageName: '@form8ion/babel-preset'},
          commitlint: {name: '@form8ion', packageName: '@form8ion/commitlint-config'}
        }
      }
    );
  });
});
