import * as renovatePlugin from '@form8ion/renovate-scaffolder';

import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';

import {javascriptPluginFactory, githubPluginFactory} from './enhanced-plugins.js';
import plugins from './plugins.js';

vi.mock('./enhanced-plugins.js');

describe('plugins', () => {
  const decisions = any.simpleObject();

  it('defines the project plugins', () => {
    const jsPlugin = any.simpleObject();
    const githubPlugin = any.simpleObject();
    when(javascriptPluginFactory).calledWith(decisions).mockReturnValue(jsPlugin);
    when(githubPluginFactory).calledWith(decisions).mockReturnValue(githubPlugin);

    expect(plugins(decisions)).toEqual({
      dependencyUpdaters: {
        Renovate: renovatePlugin
      },
      languages: {
        JavaScript: jsPlugin
      },
      vcsHosts: {
        GitHub: githubPlugin
      }
    });
  });
});
