import {questionNames as jsQuestionNames} from '@form8ion/javascript';
import {packageManagers} from '@form8ion/javascript-core';
import {scaffold as scaffoldGithub} from '@travi/github-scaffolder';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';

import {assert} from 'chai';
import * as td from 'testdouble';
import any from '@travi/any';

suite('scaffold command', () => {
  let projectScaffolder, enhancedScaffolders, command, describe, handler;

  setup(async () => {
    projectScaffolder = await td.replaceEsm('@form8ion/project');
    enhancedScaffolders = await td.replaceEsm('./enhanced-scaffolders.js');

    ({command, describe, handler} = await import('./index.js'));
  });

  teardown(() => td.reset());

  test('that the scaffold command is defined', async () => {
    const scaffoldingResults = any.simpleObject();
    const decisions = any.simpleObject();
    const decisionsWithEnhancements = {
      ...decisions,
      [projectScaffolder.questionNames.COPYRIGHT_HOLDER]: 'Matt Travi',
      [projectScaffolder.questionNames.REPO_HOST]: 'GitHub',
      [projectScaffolder.questionNames.REPO_OWNER]: 'form8ion',
      [projectScaffolder.questionNames.DEPENDENCY_UPDATER]: 'Renovate',
      [jsQuestionNames.AUTHOR_NAME]: 'Matt Travi',
      [jsQuestionNames.AUTHOR_EMAIL]: 'npm@travi.org',
      [jsQuestionNames.AUTHOR_URL]: 'https://matt.travi.org',
      [jsQuestionNames.UNIT_TEST_FRAMEWORK]: 'mocha',
      [jsQuestionNames.SCOPE]: 'form8ion',
      [jsQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM
    };
    const jsScaffolder = () => undefined;
    const githubPrompt = () => undefined;
    td.when(enhancedScaffolders.javascriptScaffolderFactory(decisionsWithEnhancements)).thenReturn(jsScaffolder);
    td.when(enhancedScaffolders.githubPromptFactory(decisionsWithEnhancements)).thenReturn(githubPrompt);
    td.when(projectScaffolder.scaffold({
      languages: {JavaScript: jsScaffolder},
      vcsHosts: {GitHub: {scaffolder: scaffoldGithub, prompt: githubPrompt, public: true}},
      overrides: {copyrightHolder: 'Matt Travi'},
      dependencyUpdaters: {Renovate: {scaffolder: scaffoldRenovate}},
      decisions: decisionsWithEnhancements
    })).thenResolve(scaffoldingResults);

    assert.equal(await handler(decisions), scaffoldingResults);
    assert.equal(command, 'scaffold');
    assert.equal(describe, 'Scaffold a new project');
  });
});
