import {scaffold as scaffoldJavaScript} from '@form8ion/javascript';
import {scaffold as scaffoldGithubActions} from '@form8ion/github-actions-node-ci';
import {scaffold as scaffoldHapi} from '@form8ion/hapi-scaffolder';
import {scaffold as scaffoldRemarkPlugin} from '@form8ion/remark-plugin-scaffolder';
import {scaffold as scaffoldScaffolder} from '@form8ion/scaffolder-scaffolder';
import {scaffold as scaffoldRollup} from '@form8ion/rollup';
import {scaffold as scaffoldVite} from '@form8ion/vite';
import {scaffold as scaffoldOctoherdScript} from '@form8ion/octoherd-script';

import {unitTestFrameworks} from '../common/test-frameworks.js';
import {javascriptConfigs} from '../common/javascript-configs.js';

export function javascriptScaffolderFactory(decisions) {
  return options => scaffoldJavaScript({
    ...options,
    configs: javascriptConfigs,
    overrides: {npmAccount: 'form8ion'},
    ciServices: {
      'GitHub Actions': {scaffolder: scaffoldGithubActions, public: true}
    },
    applicationTypes: {Hapi: {scaffolder: scaffoldHapi}},
    packageTypes: {
      'form8ion Plugin': {scaffolder: scaffoldScaffolder},
      'Remark Plugin': {scaffolder: scaffoldRemarkPlugin},
      'Octoherd Script': {scaffolder: scaffoldOctoherdScript}
    },
    unitTestFrameworks,
    packageBundlers: {
      Rollup: {scaffolder: scaffoldRollup},
      Vite: {scaffolder: scaffoldVite}
    },
    decisions
  });
}
