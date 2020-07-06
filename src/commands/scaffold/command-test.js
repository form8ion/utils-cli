import * as projectScaffolder from '@travi/project-scaffolder';
import {questionNames as jsQuestionNames} from '@travi/javascript-scaffolder';
import {scaffold as scaffoldGithub} from '@travi/github-scaffolder';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as enhancedScaffolders from './enhanced-scaffolders';
import {command, describe, handler} from '.';

suite('scaffold command', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(projectScaffolder, 'scaffold');
    sandbox.stub(enhancedScaffolders, 'javascriptScaffolderFactory');
    sandbox.stub(enhancedScaffolders, 'githubPromptFactory');
  });

  teardown(() => sandbox.restore());

  test('that the scaffold command is defined', async () => {
    const scaffoldingResults = any.simpleObject();
    const decisions = any.simpleObject();
    const decisionsWithEnhancements = {
      ...decisions,
      [projectScaffolder.questionNames.REPO_HOST]: 'GitHub',
      [projectScaffolder.questionNames.REPO_OWNER]: 'form8ion',
      [jsQuestionNames.UNIT_TEST_FRAMEWORK]: 'mocha',
      [jsQuestionNames.SCOPE]: 'form8ion'
    };
    const jsScaffolder = () => undefined;
    const githubPrompt = () => undefined;
    enhancedScaffolders.javascriptScaffolderFactory.withArgs(decisionsWithEnhancements).returns(jsScaffolder);
    enhancedScaffolders.githubPromptFactory.withArgs(decisionsWithEnhancements).returns(githubPrompt);
    projectScaffolder.scaffold
      .withArgs({
        languages: {JavaScript: jsScaffolder},
        vcsHosts: {GitHub: {scaffolder: scaffoldGithub, prompt: githubPrompt, public: true}},
        overrides: {copyrightHolder: 'Matt Travi'},
        dependencyUpdaters: {Renovate: {scaffolder: scaffoldRenovate}},
        decisions: decisionsWithEnhancements
      })
      .resolves(scaffoldingResults);

    assert.equal(await handler(decisions), scaffoldingResults);
    assert.equal(command, 'scaffold');
    assert.equal(describe, 'Scaffold a new project');
  });
});
