import {scaffold} from '@travi/project-scaffolder';
import {prompt as githubPrompt, scaffold as scaffoldGithub} from '@travi/github-scaffolder';

export function handler() {
  return scaffold({
    languages: {JavaScript: {}},
    vcsHosts: {GitHub: {scaffolder: scaffoldGithub, prompt: githubPrompt, public: true}},
    overrides: {copyrightHolder: 'Matt Travi'}
  });
}

export const command = 'scaffold';
export const describe = 'Scaffold a new project';
