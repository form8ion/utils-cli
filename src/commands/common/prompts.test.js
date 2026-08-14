import {getPrompt} from '@form8ion/cli-core';
import {promptConstants as githubPromptConstants} from '@form8ion/github';
import {promptConstants as javascriptPromptConstants} from '@form8ion/javascript';
import {packageManagers} from '@form8ion/javascript-core';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {getJavascriptPrompt, github} from './prompts.js';

vi.mock('@form8ion/cli-core');

const {
  [githubPromptConstants.ids.GITHUB_DETAILS]: githubDetailsPromptQuestionNames,
  [githubPromptConstants.ids.ADMIN_SETTINGS]: repositoryAdminSettingsPromptQuestionNames,
  [githubPromptConstants.ids.REQUIRED_CHECK_BYPASS]: requiredCheckBypassPromptQuestionNames
} = githubPromptConstants.questionNames;

const anyTeam = () => ({name: any.word(), value: any.integer(), short: any.word()});
const anyOrganization = () => {
  const login = any.word();

  return ({name: login, value: any.integer(), short: login});
};
const anyQuestion = () => ({type: any.word(), name: any.word()});

describe('prompts', () => {
  describe('github', () => {
    it('should define the `form8ion` organization as the github account', async () => {
      const form8ionOrganizationId = 49035156;

      expect(github({
        id: githubPromptConstants.ids.GITHUB_DETAILS,
        questions: [
          ...any.listOf(anyQuestion),
          {
            name: githubDetailsPromptQuestionNames.ORGANIZATION,
            type: 'list',
            choices: [
              ...any.listOf(anyOrganization),
              {name: 'form8ion', value: form8ionOrganizationId, short: 'form8ion'},
              ...any.listOf(anyOrganization)
            ]
          },
          ...any.listOf(anyQuestion)
        ]
      })).toEqual({
        [githubDetailsPromptQuestionNames.ACCOUNT_TYPE]: 'organization',
        [githubDetailsPromptQuestionNames.ORGANIZATION]: form8ionOrganizationId
      });
    });

    it('should confirm that repository admin settings should be managed as code', async () => {
      expect(github({id: githubPromptConstants.ids.ADMIN_SETTINGS, questions: any.listOf(anyQuestion)}))
        .toEqual({[repositoryAdminSettingsPromptQuestionNames.SETTINGS_MANAGED_AS_CODE]: true});
    });

    it('should define the answer for the team to bypass required checks', async () => {
      const maintainersTeamId = any.integer();
      const maintainersTeamName = any.word();
      const maintainersTeamSlug = 'maintainers';
      const questions = [
        ...any.listOf(anyQuestion),
        {
          type: 'list',
          name: requiredCheckBypassPromptQuestionNames.CHECK_BYPASS_TEAM,
          message: 'Which team should be able to bypass the required checks?',
          choices: [
            ...any.listOf(anyTeam),
            {name: maintainersTeamName, value: maintainersTeamId, short: maintainersTeamSlug},
            ...any.listOf(anyTeam)
          ]
        },
        ...any.listOf(anyQuestion)
      ];

      expect(github({id: githubPromptConstants.ids.REQUIRED_CHECK_BYPASS, questions}))
        .toEqual({[requiredCheckBypassPromptQuestionNames.CHECK_BYPASS_TEAM]: maintainersTeamId});
    });

    it('should throw an error when processing an unknown prompt', async () => {
      const unknownPromptId = any.word();

      expect(() => github({id: unknownPromptId})).toThrowError(`Unknown prompt ID: ${unknownPromptId}`);
    });
  });

  describe('getJavascriptPrompt', () => {
    const decisions = any.simpleObject();
    const questions = any.listOf(any.simpleObject);
    const answers = any.simpleObject();
    const {ids: promptIds} = javascriptPromptConstants;

    it('should define the author and package details for the `BASE_DETAILS` prompt', async () => {
      const prompt = vi.fn();
      when(getPrompt)
        .calledWith({
          ...decisions,
          [javascriptPromptConstants.questionNames.BASE_DETAILS.AUTHOR_NAME]: 'Matt Travi',
          [javascriptPromptConstants.questionNames.BASE_DETAILS.AUTHOR_EMAIL]: 'npm@travi.org',
          [javascriptPromptConstants.questionNames.BASE_DETAILS.AUTHOR_URL]: 'https://matt.travi.org',
          [javascriptPromptConstants.questionNames.BASE_DETAILS.SCOPE]: 'form8ion',
          [javascriptPromptConstants.questionNames.BASE_DETAILS.PACKAGE_MANAGER]: packageManagers.NPM
        })
        .thenReturn(prompt);
      when(prompt).calledWith({questions}).thenResolve(answers);

      expect(await getJavascriptPrompt(decisions)({id: promptIds.BASE_DETAILS, questions})).toEqual(answers);
    });

    it.each([
      ['PROJECT_TYPE_PLUGIN', promptIds.PROJECT_TYPE_PLUGIN],
      ['PACKAGE_BUNDLER', promptIds.PACKAGE_BUNDLER],
      ['UNIT_TESTING', promptIds.UNIT_TESTING],
      ['INTEGRATION_TESTING', promptIds.INTEGRATION_TESTING]
    ])('should enable input for the `%s` prompt', async (name, id) => {
      const prompt = vi.fn();
      when(getPrompt).calledWith(decisions).thenReturn(prompt);
      when(prompt).calledWith({questions}).thenResolve(answers);

      expect(await getJavascriptPrompt(decisions)({id, questions})).toEqual(answers);
    });

    it('should throw an error for an unknown prompt', async () => {
      const unknownPromptId = any.word();

      const javascriptPrompt = getJavascriptPrompt(decisions);
      await expect(() => javascriptPrompt({id: unknownPromptId})).toThrow(`Unknown prompt id: ${unknownPromptId}`);
    });
  });
});
