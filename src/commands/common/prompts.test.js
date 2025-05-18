import {promptConstants as githubPromptConstants} from '@form8ion/github';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';

import {github} from './prompts.js';

vi.mock('@form8ion/cli-core');

const {
  [githubPromptConstants.ids.GITHUB_DETAILS]: githubDetailsPromptQuestionNames,
  [githubPromptConstants.ids.ADMIN_SETTINGS]: repositoryAdminSettingsPromptQuestionNames,
  [githubPromptConstants.ids.REQUIRED_CHECK_BYPASS]: requiredCheckBypassPromptQuestionNames
} = githubPromptConstants.questionNames;

const anyTeam = () => ({name: any.word(), value: any.integer(), short: any.word()});
const anyQuestion = () => ({type: any.word()});

describe('prompts', () => {
  describe('github', () => {
    it('should define the `form8ion` organization as the github account', async () => {
      expect(github({id: githubPromptConstants.ids.GITHUB_DETAILS, questions: any.listOf(anyQuestion)}))
        .toEqual({[githubDetailsPromptQuestionNames.GITHUB_ACCOUNT]: 'form8ion'});
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
});
