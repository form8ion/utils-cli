import * as javascriptScaffolder from '@travi/javascript-scaffolder';
import * as githubScaffolder from '@travi/github-scaffolder';
import {scaffold as scaffoldGithubActions} from '@form8ion/github-actions-node-ci';
import {scaffold as scaffoldHapi} from '@form8ion/hapi-scaffolder';
import {scaffold as scaffoldRemarkPlugin} from '@form8ion/remark-plugin-scaffolder';
import {scaffold as scaffoldMocha} from '@form8ion/mocha-scaffolder';
import {scaffold as scaffoldScaffolder} from '@form8ion/scaffolder-scaffolder';
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
    javascriptScaffolder.scaffold
      .withArgs({
        ...options,
        configs: {
          eslint: {scope: '@form8ion'},
          remark: '@form8ion/remark-lint-preset',
          babelPreset: {name: '@form8ion', packageName: '@form8ion/babel-preset'},
          commitlint: {name: '@form8ion', packageName: '@form8ion/commitlint-config'}
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
        unitTestFrameworks: {mocha: {scaffolder: scaffoldMocha}},
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
