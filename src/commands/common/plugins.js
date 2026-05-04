import * as renovatePlugin from '@form8ion/renovate-scaffolder';
import * as githubWorkflowsPlugin from '@form8ion/github-workflows';

import {javascriptPluginFactory, githubPluginFactory} from './enhanced-plugins.js';

export default function plugins(decisions) {
  return {
    dependencyUpdaters: {Renovate: renovatePlugin},
    languages: {JavaScript: javascriptPluginFactory(decisions)},
    vcsHosts: {GitHub: githubPluginFactory()},
    ciProviders: {'GitHub Workflows': githubWorkflowsPlugin}
  };
}
