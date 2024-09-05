import {scaffold as scaffoldJavaScript} from '@form8ion/javascript';
import * as githubActionsPlugin from '@form8ion/github-actions-node-ci';
import * as hapiPlugin from '@form8ion/hapi-scaffolder';
import * as remarkPlugin from '@form8ion/remark-plugin-scaffolder';
import * as form8ionPlugin from '@form8ion/scaffolder-scaffolder';
import * as rollupPlugin from '@form8ion/rollup';
import * as vitePlugin from '@form8ion/vite';
import * as octoherdScriptPlugin from '@form8ion/octoherd-script';

import {unitTestFrameworks} from '../common/test-frameworks.js';
import {javascriptConfigs} from '../common/javascript-configs.js';

export function javascriptScaffolderFactory(decisions) {
  return options => scaffoldJavaScript({
    ...options,
    configs: javascriptConfigs,
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
  });
}
