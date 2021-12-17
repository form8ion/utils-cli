import * as jsLifter from '@form8ion/javascript';
import * as codecovPlugin from '@form8ion/codecov';

import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';

import {getEnhancedCodecovScaffolder, javascript} from './enhanced-lifters';

suite('enhanced lifters', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(jsLifter, 'lift');
    sandbox.stub(codecovPlugin, 'scaffold');
  });

  teardown(() => sandbox.restore());

  test('that the custom properties are passed along with the provided options to the js lifter', async () => {
    const options = any.simpleObject();
    const results = any.simpleObject();
    const packageScope = '@form8ion';
    jsLifter.lift
      .withArgs({
        ...options,
        configs: {
          eslint: {scope: packageScope},
          remark: `${packageScope}/remark-lint-preset`,
          babelPreset: {
            name: packageScope,
            packageName: `${packageScope}/babel-preset`
          },
          typescript: {scope: packageScope},
          commitlint: {
            name: packageScope,
            packageName: `${packageScope}/commitlint-config`
          }
        }
      })
      .resolves(results);

    assert.equal(await javascript(options), results);
  });

  test('that visibility is set to `Public` for Codecov since all projects in this org are public', async () => {
    const results = any.simpleObject();
    const options = any.simpleObject();
    const scaffolder = getEnhancedCodecovScaffolder();
    codecovPlugin.scaffold.withArgs({...options, visibility: 'Public'}).resolves(results);

    assert.equal(await scaffolder(options), results);
  });
});
