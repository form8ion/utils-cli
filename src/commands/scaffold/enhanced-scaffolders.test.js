import * as javascriptScaffolder from '@form8ion/javascript';
import * as githubActionsPlugin from '@form8ion/github-actions-node-ci';
import * as hapiPlugin from '@form8ion/hapi-scaffolder';
import * as form8ionPlugin from '@form8ion/scaffolder-scaffolder';
import * as remarkPlugin from '@form8ion/remark-plugin-scaffolder';
import * as octoherdScriptPlugin from '@form8ion/octoherd-script';
import * as rollupPlugin from '@form8ion/rollup';
import * as vitePlugin from '@form8ion/vite';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {javascriptScaffolderFactory} from './enhanced-scaffolders.js';
import {unitTestFrameworks} from '../common/test-frameworks.js';

describe('enhanced scaffolders', () => {
  const output = any.simpleObject();
  const decisions = any.simpleObject();

  beforeEach(() => {
    vi.mock('@form8ion/javascript');
    vi.mock('@travi/');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should pass the custom properties along with the provided options to the js scaffolder', async () => {
    const options = any.simpleObject();
    const packageScope = '@form8ion';
    when(javascriptScaffolder.scaffold).calledWith({
      ...options,
      configs: {
        eslint: {scope: packageScope},
        remark: `${packageScope}/remark-lint-preset`,
        babelPreset: {name: packageScope, packageName: `${packageScope}/babel-preset`},
        typescript: {scope: packageScope},
        commitlint: {name: packageScope, packageName: `${packageScope}/commitlint-config`}
      },
      plugins: {
        ciServices: {'GitHub Actions': githubActionsPlugin},
        applicationTypes: {Hapi: hapiPlugin},
        packageTypes: {
          'form8ion Plugin': form8ionPlugin,
          'Remark Plugin': remarkPlugin,
          'Octoherd Script': octoherdScriptPlugin
        },
        unitTestFrameworks,
        packageBundlers: {
          Rollup: rollupPlugin,
          Vite: vitePlugin
        }
      },
      decisions
    }).mockResolvedValue(output);

    expect(await javascriptScaffolderFactory(decisions)(options)).toEqual(output);
  });
});
