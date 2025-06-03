import {promptConstants as githubPromptConstants} from '@form8ion/github';

const {
  [githubPromptConstants.ids.GITHUB_DETAILS]: githubDetailsPromptQuestionNames,
  [githubPromptConstants.ids.ADMIN_SETTINGS]: repositoryAdminSettingsPromptQuestionNames,
  [githubPromptConstants.ids.REQUIRED_CHECK_BYPASS]: requiredCheckBypassPromptQuestionNames
} = githubPromptConstants.questionNames;

export function github({id, questions}) {
  switch (id) {
    case githubPromptConstants.ids.GITHUB_DETAILS:
      return {
        [githubDetailsPromptQuestionNames.ACCOUNT_TYPE]: 'organization',
        [githubDetailsPromptQuestionNames.ORGANIZATION]: questions
          .find(({name}) => name === githubDetailsPromptQuestionNames.ORGANIZATION)
          .choices
          .find(({name}) => 'form8ion' === name).value
      };
    case githubPromptConstants.ids.ADMIN_SETTINGS:
      return {[repositoryAdminSettingsPromptQuestionNames.SETTINGS_MANAGED_AS_CODE]: true};
    case githubPromptConstants.ids.REQUIRED_CHECK_BYPASS:
      return {
        [requiredCheckBypassPromptQuestionNames.CHECK_BYPASS_TEAM]: questions
          .find(({name}) => name === requiredCheckBypassPromptQuestionNames.CHECK_BYPASS_TEAM)
          .choices
          .find(({short}) => 'maintainers' === short).value
      };
    default:
      throw new Error(`Unknown prompt ID: ${id}`);
  }
}
