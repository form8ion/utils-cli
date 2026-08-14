import {getPrompt} from '@form8ion/cli-core';
import {promptConstants as githubPromptConstants} from '@form8ion/github';
import {promptConstants as javascriptPromptConstants} from '@form8ion/javascript';
import {packageManagers} from '@form8ion/javascript-core';

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

export function getJavascriptPrompt(decisions) {
  const {questionNames: questionNamesByPromptId, ids: promptIds} = javascriptPromptConstants;

  return ({id, questions}) => {
    switch (id) {
      case promptIds.BASE_DETAILS:
        return getPrompt({
          ...decisions,
          [questionNamesByPromptId[promptIds.BASE_DETAILS].AUTHOR_NAME]: 'Matt Travi',
          [questionNamesByPromptId[promptIds.BASE_DETAILS].AUTHOR_EMAIL]: 'npm@travi.org',
          [questionNamesByPromptId[promptIds.BASE_DETAILS].AUTHOR_URL]: 'https://matt.travi.org',
          [questionNamesByPromptId[promptIds.BASE_DETAILS].SCOPE]: 'form8ion',
          [questionNamesByPromptId[promptIds.BASE_DETAILS].PACKAGE_MANAGER]: packageManagers.NPM
        })({questions});
      case promptIds.PROJECT_TYPE_PLUGIN:
      case promptIds.PACKAGE_BUNDLER:
      case promptIds.UNIT_TESTING:
      case promptIds.INTEGRATION_TESTING:
        return getPrompt(decisions)({questions});
      default:
        throw new Error(`Unknown prompt id: ${id}`);
    }
  };
}
