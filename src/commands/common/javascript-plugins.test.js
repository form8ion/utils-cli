import * as githubActionsPlugin from '@form8ion/github-actions-node-ci';
import * as hapiPlugin from '@form8ion/hapi-scaffolder';
import * as form8ionPlugin from '@form8ion/scaffolder-scaffolder';
import * as remarkPlugin from '@form8ion/remark-plugin-scaffolder';
import * as octoherdScriptPlugin from '@form8ion/octoherd-script';
import * as rollupPlugin from '@form8ion/rollup';
import * as vitePlugin from '@form8ion/vite';

import {describe, expect, it} from 'vitest';

import {unitTestFrameworks} from './test-frameworks.js';
import getJavascriptPlugins from './javascript-plugins.js';

describe('javascript plugins', () => {
  it('should return the javascript plugins', () => {
    expect(getJavascriptPlugins()).toEqual({
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
    });
  });
});
