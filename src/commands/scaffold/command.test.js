import * as projectScaffolder from '@form8ion/project';
import {questionNames as jsQuestionNames} from '@form8ion/javascript';
import {packageManagers} from '@form8ion/javascript-core';
import * as githubPlugin from '@form8ion/github';
import * as renovatePlugin from '@form8ion/renovate-scaffolder';

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
    const githubPromptConstants = githubPlugin.promptConstants;
    const githubDetailsPromptQuestionNames = githubPromptConstants.questionNames[
      githubPromptConstants.ids.GITHUB_DETAILS
    ];
    const decisionsWithEnhancements = {
      ...decisions,
      [projectScaffolder.questionNames.COPYRIGHT_HOLDER]: 'Matt Travi',
      [projectScaffolder.questionNames.REPO_HOST]: 'GitHub',
      [projectScaffolder.questionNames.DEPENDENCY_UPDATER]: 'Renovate',
      [githubDetailsPromptQuestionNames.GITHUB_ACCOUNT]: 'form8ion',
      [jsQuestionNames.AUTHOR_NAME]: 'Matt Travi',
      [jsQuestionNames.AUTHOR_EMAIL]: 'npm@travi.org',
      [jsQuestionNames.AUTHOR_URL]: 'https://matt.travi.org',
      [jsQuestionNames.SCOPE]: 'form8ion',
      [jsQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM
    };
    const jsScaffolder = () => undefined;
    when(enhancedScaffolders.javascriptScaffolderFactory)
      .calledWith(decisionsWithEnhancements)
      .mockReturnValue(jsScaffolder);
    when(projectScaffolder.scaffold).calledWith({
      plugins: {
        languages: {JavaScript: {scaffold: jsScaffolder}},
        vcsHosts: {GitHub: githubPlugin},
        dependencyUpdaters: {Renovate: renovatePlugin}
      },
      decisions: decisionsWithEnhancements
    }).mockResolvedValue(scaffoldingResults);

    expect(await handler(decisions)).toEqual(scaffoldingResults);
    expect(command).toEqual('scaffold');
    expect(commandDescription).toEqual('Scaffold a new project');
  });
});
