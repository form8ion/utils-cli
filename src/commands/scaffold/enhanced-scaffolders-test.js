import * as javascriptScaffolder from '@form8ion/javascript';
import * as githubScaffolder from '@travi/github-scaffolder';
import {scaffold as scaffoldGithubActions} from '@form8ion/github-actions-node-ci';
import {scaffold as scaffoldHapi} from '@form8ion/hapi-scaffolder';
import {scaffold as scaffoldRemarkPlugin} from '@form8ion/remark-plugin-scaffolder';
import {scaffold as scaffoldMocha} from '@form8ion/mocha-scaffolder';
import {scaffold as scaffoldVitest} from '@form8ion/vitest';
import {scaffold as scaffoldScaffolder} from '@form8ion/scaffolder-scaffolder';
import {scaffold as scaffoldRollup} from '@form8ion/rollup';
import {scaffold as scaffoldVite} from '@form8ion/vite';

import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';

import {javascriptScaffolderFactory, githubPromptFactory} from './enhanced-scaffolders';

suite('enhanced scaffolders', () => {
  let sandbox;
  const output = any.simpleObject();
  const decisions = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(javascriptScaffolder, 'scaffold');
    sandbox.stub(githubScaffolder, 'prompt');
  });

  teardown(() => sandbox.restore());

  test('that the custom properties are passed along with the provided options to the js scaffolder', async () => {
    const options = any.simpleObject();
    const packageScope = '@form8ion';
    javascriptScaffolder.scaffold
      .withArgs({
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
          'Scaffolder Plugin': {scaffolder: scaffoldScaffolder},
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
      })
      .resolves(output);

    assert.equal(await javascriptScaffolderFactory(decisions)(options), output);
  });

  test('that the owner account is passed to the github prompts', async () => {
    githubScaffolder.prompt.withArgs({account: 'form8ion', decisions}).resolves(output);

    assert.equal(await githubPromptFactory(decisions)(), output);
  });
});
