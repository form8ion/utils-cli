import * as renovatePlugin from '@form8ion/renovate-scaffolder';

import {javascriptPluginFactory, githubPluginFactory} from './enhanced-plugins.js';

export default function plugins(decisions) {
  return {
    dependencyUpdaters: {Renovate: renovatePlugin},
    languages: {JavaScript: javascriptPluginFactory(decisions)},
    vcsHosts: {GitHub: githubPluginFactory()}
  };
}
