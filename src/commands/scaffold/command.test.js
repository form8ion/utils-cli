import * as projectScaffolder from '@form8ion/project';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';
import projectPlugins from '../common/plugins.js';
import {getProjectPrompt} from './prompts.js';
import {command, describe as commandDescription, handler} from './index.js';

vi.mock('@form8ion/project');
vi.mock('../common/plugins.js');
vi.mock('./prompts.js');

describe('scaffold command', () => {
  it('should define the scaffold command', async () => {
    const scaffoldingResults = any.simpleObject();
    const decisions = any.simpleObject();
    const projectPluginGroups = any.objectWithKeys(any.listOf(any.word), {factory: any.simpleObject});
    const prompt = () => undefined;
    when(projectPlugins).calledWith(decisions).thenReturn(projectPluginGroups);
    when(getProjectPrompt).calledWith(decisions).thenReturn(prompt);
    when(projectScaffolder.scaffold)
      .calledWith({plugins: projectPluginGroups}, {prompt})
      .thenResolve(scaffoldingResults);

    expect(await handler(decisions)).toEqual(scaffoldingResults);
    expect(command).toEqual('scaffold');
    expect(commandDescription).toEqual('Scaffold a new project');
  });
});
