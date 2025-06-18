import {getPrompt} from '@form8ion/cli-core';
import {promptConstants, questionNames as projectQuestionNames, questionNames} from '@form8ion/project';

export function getProjectPrompt(decisions) {
  return ({id, questions}) => {
    switch (id) {
      case promptConstants.ids.BASE_DETAILS:
        return getPrompt({...decisions, [projectQuestionNames.COPYRIGHT_HOLDER]: 'Matt Travi'})({questions});
      case promptConstants.ids.GIT_REPOSITORY:
      case promptConstants.ids.PROJECT_LANGUAGE:
        return getPrompt(decisions)({questions});
      case promptConstants.ids.REPOSITORY_HOST:
        return {[questionNames.REPO_HOST]: 'GitHub'};
      case promptConstants.ids.DEPENDENCY_UPDATER:
        return {[questionNames.DEPENDENCY_UPDATER]: 'Renovate'};
      default:
        throw new Error(`Unknown prompt id: ${id}`);
    }
  };
}
