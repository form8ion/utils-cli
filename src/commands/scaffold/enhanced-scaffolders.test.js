import * as javascriptScaffolder from '@form8ion/javascript';
import * as githubScaffolder from '@travi/github-scaffolder';
import {scaffold as scaffoldGithubActions} from '@form8ion/github-actions-node-ci';
import {scaffold as scaffoldHapi} from '@form8ion/hapi-scaffolder';
import {scaffold as scaffoldScaffolder} from '@form8ion/scaffolder-scaffolder';
import {scaffold as scaffoldRemarkPlugin} from '@form8ion/remark-plugin-scaffolder';
import {scaffold as scaffoldOctoherdScript} from '@form8ion/octoherd-script';
import {scaffold as scaffoldRollup} from '@form8ion/rollup';
import {scaffold as scaffoldVite} from '@form8ion/vite';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {githubPromptFactory, javascriptScaffolderFactory} from './enhanced-scaffolders.js';
import {unitTestFrameworks} from '../common/test-frameworks.js';

describe('enhanced scaffolders', () => {
  const output = any.simpleObject();
  const decisions = any.simpleObject();

  beforeEach(() => {
    vi.mock('@form8ion/javascript');
    vi.mock('@travi/github-scaffolder');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should pass the custom properties along with the provided options to the js scaffolder', async () => {
    const options = any.simpleObject();
    const packageScope = '@form8ion';
    when(javascriptScaffolder.scaffold).calledWith({
      ...options,
      configs: {
        eslint: {scope: packageScope},
        remark: `${packageScope}/remark-lint-preset`,
        babelPreset: {name: packageScope, packageName: `${packageScope}/babel-preset`},
        typescript: {scope: packageScope},
        commitlint: {name: packageScope, packageName: `${packageScope}/commitlint-config`}
      },
      overrides: {npmAccount: 'form8ion'},
      ciServices: {
        'GitHub Actions': {scaffolder: scaffoldGithubActions, public: true}
      },
      applicationTypes: {Hapi: {scaffolder: scaffoldHapi}},
      packageTypes: {
        'form8ion Plugin': {scaffolder: scaffoldScaffolder},
        'Remark Plugin': {scaffolder: scaffoldRemarkPlugin},
        'Octoherd Script': {scaffolder: scaffoldOctoherdScript}
      },
      unitTestFrameworks,
      packageBundlers: {
        Rollup: {scaffolder: scaffoldRollup},
        Vite: {scaffolder: scaffoldVite}
      },
      decisions
    }).mockResolvedValue(output);

    expect(await javascriptScaffolderFactory(decisions)(options)).toEqual(output);
  });

  it('should pass the owner account to the github prompts', async () => {
    when(githubScaffolder.prompt).calledWith({account: 'form8ion', decisions}).mockResolvedValue(output);

    expect(await githubPromptFactory(decisions)()).toEqual(output);
  });
});
