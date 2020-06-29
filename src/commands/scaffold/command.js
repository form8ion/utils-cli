import {scaffold, questionNames as projectQuestionNames} from '@travi/project-scaffolder';
import {questionNames as jsQuestionNames} from '@travi/javascript-scaffolder';
import {scaffold as scaffoldGithub} from '@travi/github-scaffolder';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {githubPromptFactory, javascriptScaffolderFactory} from './enhanced-scaffolders';

export function handler(decisions) {
  const decisionsWithEnhancements = {
    ...decisions,
    [projectQuestionNames.REPO_HOST]: 'GitHub',
    [projectQuestionNames.REPO_OWNER]: 'form8ion',
    [jsQuestionNames.UNIT_TEST_FRAMEWORK]: 'mocha'
  };

  return scaffold({
    languages: {JavaScript: javascriptScaffolderFactory(decisionsWithEnhancements)},
    vcsHosts: {
      GitHub: {scaffolder: scaffoldGithub, prompt: githubPromptFactory(decisionsWithEnhancements), public: true}
    },
    overrides: {copyrightHolder: 'Matt Travi'},
    dependencyUpdaters: {Renovate: {scaffolder: scaffoldRenovate}},
    decisions: decisionsWithEnhancements
  });
}

export const command = 'scaffold';
export const describe = 'Scaffold a new project';
