import * as renovatePlugin from '@form8ion/renovate-scaffolder';
import * as githubPlugin from '@form8ion/github';

import {javascriptPluginFactory} from './enhanced-plugins.js';

export default function (decisions) {
  return {
    dependencyUpdaters: {
      Renovate: renovatePlugin
    },
    languages: {
      JavaScript: javascriptPluginFactory(decisions)
    },
    vcsHosts: {
      GitHub: githubPlugin
    }
  };
}
