import {scaffold as scaffoldJavaScript} from '@form8ion/javascript';
import {scaffold as scaffoldGithubActions} from '@form8ion/github-actions-node-ci';
import {prompt} from '@travi/github-scaffolder';
import {scaffold as scaffoldHapi} from '@form8ion/hapi-scaffolder';
import {scaffold as scaffoldRemarkPlugin} from '@form8ion/remark-plugin-scaffolder';
import {scaffold as scaffoldMocha} from '@form8ion/mocha-scaffolder';
import {scaffold as scaffoldScaffolder} from '@form8ion/scaffolder-scaffolder';
import {scaffold as scaffoldVitest} from '@form8ion/vitest';
import {scaffold as scaffoldRollup} from '@form8ion/rollup';
import {scaffold as scaffoldVite} from '@form8ion/vite';

import {javascriptConfigs} from '../common';

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
      'Remark Plugin': {scaffolder: scaffoldRemarkPlugin}
    },
    unitTestFrameworks: {
      mocha: {scaffolder: scaffoldMocha},
      vitest: {scaffolder: scaffoldVitest}
    },
    packageBundlers: {
      Rollup: {scaffolder: scaffoldRollup},
      Vite: {scaffolder: scaffoldVite}
    },
    decisions
  });
}

export function githubPromptFactory(decisions) {
  return () => prompt({account: 'form8ion', decisions});
}
