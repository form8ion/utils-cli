import {ungroupObject} from '@form8ion/core';
import {lift as liftJavascript, test as testForJavascript} from '@form8ion/javascript';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import getJavascriptPlugins from '../common/javascript-plugins.js';
import {javascriptLifterFactory, javascriptTesterFactory} from './enhanced-lifters.js';

vi.mock('@form8ion/core');
vi.mock('@form8ion/javascript');
vi.mock('@form8ion/codecov');
vi.mock('@form8ion/github');
vi.mock('../common/javascript-plugins.js');

describe('enhanced lifters', () => {
  const options = any.simpleObject();
  const dependencies = any.simpleObject();
  const packageScope = '@form8ion';

  it(
    'should pass the custom properties and injected dependencies with the provided options to the js lifter',
    async () => {
      const results = any.simpleObject();
      const pluginGroups = any.objectWithKeys(any.listOf(any.word), {factory: any.simpleObject});
      const ungroupedPlugins = any.simpleObject();
      when(getJavascriptPlugins).calledWith({}).thenReturn(pluginGroups);
      when(ungroupObject).calledWith(pluginGroups).thenReturn(ungroupedPlugins);
      when(liftJavascript).calledWith({
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
        },
        enhancers: ungroupedPlugins
      }, dependencies).thenResolve(results);

      expect(await javascriptLifterFactory(dependencies)(options)).toEqual(results);
    }
  );

  it('should pass injected dependencies with the provided options to the js tester', async () => {
    const determination = any.boolean();
    when(testForJavascript).calledWith(options, dependencies).thenResolve(determination);

    expect(await javascriptTesterFactory(dependencies)(options)).toEqual(determination);
  });
});
