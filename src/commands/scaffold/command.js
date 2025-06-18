import {scaffold} from '@form8ion/project';

import projectPlugins from '../common/plugins.js';
import {getProjectPrompt} from './prompts.js';

export function handler(decisions) {
  return scaffold({plugins: projectPlugins(decisions)}, {prompt: getProjectPrompt(decisions)});
}

export const command = 'scaffold';
export const describe = 'Scaffold a new project';
