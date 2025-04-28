import * as projectScaffolder from '@form8ion/project';
import {questionNames as jsQuestionNames} from '@form8ion/javascript';
import {packageManagers} from '@form8ion/javascript-core';
import {promptConstants as githubPromptConstants} from '@form8ion/github';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';
import {command, describe as commandDescription, handler} from './index.js';
import projectPlugins from '../common/plugins.js';

vi.mock('@form8ion/project');
vi.mock('../common/plugins.js');

describe('scaffold command', () => {
  it('should define the scaffold command', async () => {
    const scaffoldingResults = any.simpleObject();
    const decisions = any.simpleObject();
    const {
      [githubPromptConstants.ids.GITHUB_DETAILS]: githubDetailsPromptQuestionNames,
      [githubPromptConstants.ids.ADMIN_SETTINGS]: repositoryAdminSettingsPromptQuestionNames,
      [githubPromptConstants.ids.REQUIRED_CHECK_BYPASS]: requiredCheckBypassPromptQuestionNames
    } = githubPromptConstants.questionNames;
    const projectPluginGroups = any.objectWithKeys(any.listOf(any.word), {factory: any.simpleObject});
    const decisionsWithEnhancements = {
      ...decisions,
      [projectScaffolder.questionNames.COPYRIGHT_HOLDER]: 'Matt Travi',
      [projectScaffolder.questionNames.REPO_HOST]: 'GitHub',
      [projectScaffolder.questionNames.DEPENDENCY_UPDATER]: 'Renovate',
      [githubDetailsPromptQuestionNames.GITHUB_ACCOUNT]: 'form8ion',
      [repositoryAdminSettingsPromptQuestionNames.SETTINGS_MANAGED_AS_CODE]: true,
      [requiredCheckBypassPromptQuestionNames.CHECK_BYPASS_TEAM]: 3208999,
      [jsQuestionNames.AUTHOR_NAME]: 'Matt Travi',
      [jsQuestionNames.AUTHOR_EMAIL]: 'npm@travi.org',
      [jsQuestionNames.AUTHOR_URL]: 'https://matt.travi.org',
      [jsQuestionNames.SCOPE]: 'form8ion',
      [jsQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM
    };
    when(projectPlugins).calledWith(decisionsWithEnhancements).thenReturn(projectPluginGroups);
    when(projectScaffolder.scaffold)
      .calledWith({plugins: projectPluginGroups, decisions: decisionsWithEnhancements})
      .thenResolve(scaffoldingResults);

    expect(await handler(decisions)).toEqual(scaffoldingResults);
    expect(command).toEqual('scaffold');
    expect(commandDescription).toEqual('Scaffold a new project');
  });
});
