import * as projectScaffolder from '@form8ion/project';
import {questionNames as jsQuestionNames} from '@form8ion/javascript';
import {packageManagers} from '@form8ion/javascript-core';
import {scaffold as scaffoldGithub} from '@travi/github-scaffolder';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as enhancedScaffolders from './enhanced-scaffolders.js';
import {command, describe as commandDescription, handler} from './index.js';

describe('scaffold command', () => {
  beforeEach(() => {
    vi.mock('@form8ion/project');
    vi.mock('./enhanced-scaffolders.js');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should define the scaffold command', async () => {
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
      [jsQuestionNames.SCOPE]: 'form8ion',
      [jsQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM
    };
    const jsScaffolder = () => undefined;
    const githubPrompt = () => undefined;
    when(enhancedScaffolders.javascriptScaffolderFactory)
      .calledWith(decisionsWithEnhancements)
      .mockReturnValue(jsScaffolder);
    when(enhancedScaffolders.githubPromptFactory).calledWith(decisionsWithEnhancements).mockReturnValue(githubPrompt);
    when(projectScaffolder.scaffold).calledWith({
      languages: {JavaScript: jsScaffolder},
      vcsHosts: {GitHub: {scaffolder: scaffoldGithub, prompt: githubPrompt, public: true}},
      dependencyUpdaters: {Renovate: {scaffolder: scaffoldRenovate}},
      decisions: decisionsWithEnhancements
    }).mockResolvedValue(scaffoldingResults);

    expect(await handler(decisions)).toEqual(scaffoldingResults);
    expect(command).toEqual('scaffold');
    expect(commandDescription).toEqual('Scaffold a new project');
  });
});
