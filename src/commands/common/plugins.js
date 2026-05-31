import * as renovatePlugin from '@form8ion/renovate-scaffolder';
import * as githubWorkflowsPlugin from '@form8ion/github-workflows';
import {logger} from '@form8ion/cli-core';

import {javascriptPluginFactory, githubPluginFactory} from './enhanced-plugins.js';

export default function plugins(decisions) {
  return {
    dependencyUpdaters: {Renovate: renovatePlugin},
    languages: {JavaScript: javascriptPluginFactory(decisions, {logger})},
    vcsHosts: {GitHub: githubPluginFactory()},
    ciProviders: {'GitHub Workflows': githubWorkflowsPlugin}
  };
}
