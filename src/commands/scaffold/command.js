import {scaffold} from '@form8ion/project';
import {reportResults} from '@form8ion/results-reporter';

import projectPlugins from '../common/plugins.js';
import {getProjectPrompt} from './prompts.js';

export async function handler(decisions) {
  const results = await scaffold({plugins: projectPlugins(decisions)}, {prompt: getProjectPrompt(decisions)});

  reportResults(results);

  return results;
}

export const command = 'scaffold';
export const describe = 'Scaffold a new project';
