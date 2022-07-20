import td from 'testdouble';
import any from '@travi/any';
import {assert} from 'chai';

suite('enhanced lifters', () => {
  let jsLifter, codecovPlugin, getEnhancedCodecovScaffolder, javascript;

  setup(() => {
    jsLifter = td.replace('@form8ion/javascript');
    codecovPlugin = td.replace('@form8ion/codecov');

    ({getEnhancedCodecovScaffolder, javascript} = require('./enhanced-lifters'));
  });

  teardown(() => td.reset());

  test('that the custom properties are passed along with the provided options to the js lifter', async () => {
    const options = any.simpleObject();
    const results = any.simpleObject();
    const packageScope = '@form8ion';
    td.when(jsLifter.lift({
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
    })).thenResolve(results);

    assert.equal(await javascript(options), results);
  });

  test('that visibility is set to `Public` for Codecov since all projects in this org are public', async () => {
    const results = any.simpleObject();
    const options = any.simpleObject();
    const scaffolder = getEnhancedCodecovScaffolder();
    td.when(codecovPlugin.scaffold({...options, visibility: 'Public'})).thenResolve(results);

    assert.equal(await scaffolder(options), results);
  });
});
