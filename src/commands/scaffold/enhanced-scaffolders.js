import {scaffold as scaffoldJavaScript} from '@form8ion/javascript';
import {scaffold as scaffoldGithub} from '@form8ion/github';
import {octokit} from '@form8ion/github-core';

import {javascriptConfigs} from '../common/javascript-configs.js';
import getJavascriptPlugins from '../common/javascript-plugins.js';

export function javascriptScaffolderFactory(decisions) {
  return options => scaffoldJavaScript({
    ...options,
    configs: javascriptConfigs,
    plugins: getJavascriptPlugins({}),
    decisions
  });
}

export function githubScaffolderFactory() {
  const octokitInstance = octokit.getNetrcAuthenticatedInstance();

  return (options, dependencies) => scaffoldGithub(options, {...dependencies, octokit: octokitInstance});
}
