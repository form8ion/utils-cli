import {questionNames as projectQuestionNames, scaffold} from '@form8ion/project';
import {packageManagers} from '@form8ion/javascript-core';
import {questionNames as jsQuestionNames} from '@form8ion/javascript';
import {promptConstants as githubPromptConstants} from '@form8ion/github';

import projectPlugins from '../common/plugins.js';

const githubDetailsPromptQuestionNames = githubPromptConstants.questionNames[githubPromptConstants.ids.GITHUB_DETAILS];
const requiredCheckBypassPromptQuestionNames = githubPromptConstants.questionNames[
  githubPromptConstants.ids.REQUIRED_CHECK_BYPASS
];

export function handler(decisions) {
  const orgName = 'form8ion';
  const githubMaintainersTeamId = 3208999;
  const traviName = 'Matt Travi';
  const decisionsWithEnhancements = {
    ...decisions,
    [projectQuestionNames.COPYRIGHT_HOLDER]: traviName,
    [projectQuestionNames.REPO_HOST]: 'GitHub',
    [projectQuestionNames.DEPENDENCY_UPDATER]: 'Renovate',
    [githubDetailsPromptQuestionNames.GITHUB_ACCOUNT]: orgName,
    [requiredCheckBypassPromptQuestionNames.CHECK_BYPASS_TEAM]: githubMaintainersTeamId,
    [jsQuestionNames.AUTHOR_NAME]: traviName,
    [jsQuestionNames.AUTHOR_EMAIL]: 'npm@travi.org',
    [jsQuestionNames.AUTHOR_URL]: 'https://matt.travi.org',
    [jsQuestionNames.SCOPE]: orgName,
    [jsQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM
  };

  return scaffold({
    plugins: projectPlugins(decisionsWithEnhancements),
    decisions: decisionsWithEnhancements
  });
}

export const command = 'scaffold';
export const describe = 'Scaffold a new project';
