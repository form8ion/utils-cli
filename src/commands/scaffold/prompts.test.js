import {getPrompt} from '@form8ion/cli-core';
import {promptConstants, questionNames as projectQuestionNames, questionNames} from '@form8ion/project';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {getProjectPrompt} from './prompts.js';

vi.mock('@form8ion/cli-core');

describe('scaffolder prompts', () => {
  const decisions = any.simpleObject();
  const questions = any.listOf(any.simpleObject);
  const answers = any.simpleObject();

  it('should define the copyright owner for the `BASE_DETAILS` prompt', async () => {
    const prompt = vi.fn();
    when(getPrompt)
      .calledWith({...decisions, [projectQuestionNames.COPYRIGHT_HOLDER]: 'Matt Travi'})
      .thenReturn(prompt);
    when(prompt).calledWith({questions}).thenResolve(answers);

    expect(await getProjectPrompt(decisions)({id: promptConstants.ids.BASE_DETAILS, questions})).toEqual(answers);
  });

  it('should enable input for the `GIT_REPOSITORY` prompt', async () => {
    const prompt = vi.fn();
    when(getPrompt).calledWith(decisions).thenReturn(prompt);
    when(prompt).calledWith({questions}).thenResolve(answers);

    expect(await getProjectPrompt(decisions)({id: promptConstants.ids.GIT_REPOSITORY, questions})).toEqual(answers);
  });

  it('should enable input for the `PROJECT_LANGUAGE` prompt', async () => {
    const prompt = vi.fn();
    when(getPrompt).calledWith(decisions).thenReturn(prompt);
    when(prompt).calledWith({questions}).thenResolve(answers);

    expect(await getProjectPrompt(decisions)({id: promptConstants.ids.PROJECT_LANGUAGE, questions})).toEqual(answers);
  });

  it('should define GitHub as the target vcs repository host', async () => {
    expect(getProjectPrompt(decisions)({id: promptConstants.ids.REPOSITORY_HOST}))
      .toEqual({[questionNames.REPO_HOST]: 'GitHub'});
  });

  it('should define Renovate as the target dependency updater', async () => {
    expect(getProjectPrompt(decisions)({id: promptConstants.ids.DEPENDENCY_UPDATER}))
      .toEqual({[questionNames.DEPENDENCY_UPDATER]: 'Renovate'});
  });

  it('should throw an error for an unknown prompt', async () => {
    const unknownPromptId = any.word();

    const projectPrompt = getProjectPrompt(decisions);
    await expect(() => projectPrompt({id: unknownPromptId})).toThrow(`Unknown prompt id: ${unknownPromptId}`);
  });
});
