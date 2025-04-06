import {getPrompt} from '@form8ion/cli-core';
import {scaffold as scaffoldJavaScript} from '@form8ion/javascript';
import {scaffold as scaffoldGithub} from '@form8ion/github';

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

export function githubScaffolderFactory({octokit, decisions}) {
  return options => scaffoldGithub(options, {octokit, prompt: getPrompt(decisions)});
}
