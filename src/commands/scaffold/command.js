import {scaffold} from '@form8ion/project';
import {reportResults} from '@form8ion/results-reporter';
import {logger} from '@form8ion/cli-core';

import projectPlugins from '../common/plugins.js';
import {getProjectPrompt} from './prompts.js';

export async function handler(decisions) {
  const results = await scaffold({plugins: projectPlugins(decisions)}, {prompt: getProjectPrompt(decisions), logger});

  reportResults(results);

  return results;
}

export const command = 'scaffold';
export const describe = 'Scaffold a new project';
