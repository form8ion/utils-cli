import * as javascriptScaffolder from '@travi/javascript-scaffolder';
import * as githubScaffolder from '@travi/github-scaffolder';
import {scaffold as scaffoldTravisForJavaScript} from '@travi/travis-scaffolder-javascript';
import {scaffold as scaffoldHapi} from '@form8ion/hapi-scaffolder';
import {scaffold as scaffoldRemarkPlugin} from '@form8ion/remark-plugin-scaffolder';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import {javascript, githubPrompt} from './enhanced-scaffolders';

suite('enhanced scaffolders', () => {
  let sandbox;
  const output = any.simpleObject();

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
        ciServices: {Travis: {scaffolder: scaffoldTravisForJavaScript, public: true}},
        applicationTypes: {Hapi: {scaffolder: scaffoldHapi}},
        packageTypes: {'Remark Plugin': {scaffolder: scaffoldRemarkPlugin}}
      })
      .resolves(output);

    assert.equal(await javascript(options), output);
  });

  test('that the owner account is passed to the github prompts', async () => {
    githubScaffolder.prompt.withArgs({account: 'form8ion'}).resolves(output);

    assert.equal(await githubPrompt(), output);
  });
});
