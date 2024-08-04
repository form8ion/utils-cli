import {scaffold, questionNames as projectQuestionNames} from '@form8ion/project';
import {packageManagers} from '@form8ion/javascript-core';
import {questionNames as jsQuestionNames} from '@form8ion/javascript';
import * as githubPlugin from '@form8ion/github';
import * as renovatePlugin from '@form8ion/renovate-scaffolder';

import {javascriptScaffolderFactory} from './enhanced-scaffolders.js';

const githubPromptConstants = githubPlugin.promptConstants;
const githubDetailsPromptQuestionNames = githubPromptConstants.questionNames[githubPromptConstants.ids.GITHUB_DETAILS];

export function handler(decisions) {
  const orgName = 'form8ion';
  const traviName = 'Matt Travi';
  const decisionsWithEnhancements = {
    ...decisions,
    [projectQuestionNames.COPYRIGHT_HOLDER]: traviName,
    [projectQuestionNames.REPO_HOST]: 'GitHub',
    [projectQuestionNames.DEPENDENCY_UPDATER]: 'Renovate',
    [githubDetailsPromptQuestionNames.GITHUB_ACCOUNT]: orgName,
    [jsQuestionNames.AUTHOR_NAME]: traviName,
    [jsQuestionNames.AUTHOR_EMAIL]: 'npm@travi.org',
    [jsQuestionNames.AUTHOR_URL]: 'https://matt.travi.org',
    [jsQuestionNames.SCOPE]: orgName,
    [jsQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM
  };

  return scaffold({
    plugins: {
      languages: {JavaScript: {scaffold: javascriptScaffolderFactory(decisionsWithEnhancements)}},
      vcsHosts: {GitHub: githubPlugin},
      dependencyUpdaters: {Renovate: renovatePlugin}
    },
    decisions: decisionsWithEnhancements
  });
}

export const command = 'scaffold';
export const describe = 'Scaffold a new project';
