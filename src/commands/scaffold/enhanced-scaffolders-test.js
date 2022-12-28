import {scaffold as scaffoldGithubActions} from '@form8ion/github-actions-node-ci';
import {scaffold as scaffoldHapi} from '@form8ion/hapi-scaffolder';
import {scaffold as scaffoldRemarkPlugin} from '@form8ion/remark-plugin-scaffolder';
import {scaffold as scaffoldMocha} from '@form8ion/mocha-scaffolder';
import {scaffold as scaffoldVitest} from '@form8ion/vitest';
import {scaffold as scaffoldScaffolder} from '@form8ion/scaffolder-scaffolder';
import {scaffold as scaffoldRollup} from '@form8ion/rollup';
import {scaffold as scaffoldVite} from '@form8ion/vite';
import {scaffold as scaffoldOctoherdScript} from '@form8ion/octoherd-script';

import {assert} from 'chai';
import td from 'testdouble';
import any from '@travi/any';

suite('enhanced scaffolders', () => {
  let javascriptScaffolder, githubScaffolder, javascriptScaffolderFactory, githubPromptFactory;
  const output = any.simpleObject();
  const decisions = any.simpleObject();

  setup(() => {
    javascriptScaffolder = td.replace('@form8ion/javascript');
    githubScaffolder = td.replace('@travi/github-scaffolder');

    ({javascriptScaffolderFactory, githubPromptFactory} = require('./enhanced-scaffolders'));
  });

  teardown(() => td.reset());

  test('that the custom properties are passed along with the provided options to the js scaffolder', async () => {
    const options = any.simpleObject();
    const packageScope = '@form8ion';
    td.when(javascriptScaffolder.scaffold({
      ...options,
      configs: {
        eslint: {scope: packageScope},
        remark: `${packageScope}/remark-lint-preset`,
        babelPreset: {name: packageScope, packageName: `${packageScope}/babel-preset`},
        typescript: {scope: packageScope},
        commitlint: {name: packageScope, packageName: `${packageScope}/commitlint-config`}
      },
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
      unitTestFrameworks: {
        mocha: {scaffolder: scaffoldMocha},
        vitest: {scaffolder: scaffoldVitest}
      },
      packageBundlers: {
        Rollup: {scaffolder: scaffoldRollup},
        Vite: {scaffolder: scaffoldVite}
      },
      decisions
    })).thenResolve(output);

    assert.equal(await javascriptScaffolderFactory(decisions)(options), output);
  });

  test('that the owner account is passed to the github prompts', async () => {
    td.when(githubScaffolder.prompt({account: 'form8ion', decisions})).thenResolve(output);

    assert.equal(await githubPromptFactory(decisions)(), output);
  });
});
