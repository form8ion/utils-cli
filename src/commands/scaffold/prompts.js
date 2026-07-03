import {getPrompt} from '@form8ion/cli-core';
import {promptConstants} from '@form8ion/project';

export function getProjectPrompt(decisions) {
  const {questionNames: questionNamesByPromptId, ids: promptIds} = promptConstants;

  return ({id, questions}) => {
    switch (id) {
      case promptIds.BASE_DETAILS:
        return getPrompt({
          ...decisions,
          [questionNamesByPromptId[promptIds.BASE_DETAILS].COPYRIGHT_HOLDER]: 'Matt Travi'
        })({questions});
      case promptIds.GIT_REPOSITORY:
      case promptIds.PROJECT_LANGUAGE:
        return getPrompt(decisions)({questions});
      case promptIds.REPOSITORY_HOST:
        return {[questionNamesByPromptId[promptIds.REPOSITORY_HOST].REPO_HOST]: 'GitHub'};
      case promptIds.CI_PROVIDER:
        return {[questionNamesByPromptId[promptIds.CI_PROVIDER].CI_PROVIDER]: 'GitHub Workflows'};
      case promptIds.COVERAGE_SERVICE:
        return {[questionNamesByPromptId[promptIds.COVERAGE_SERVICE].COVERAGE_SERVICE]: 'Codecov'};
      case promptIds.DEPENDENCY_UPDATER:
        return {[questionNamesByPromptId[promptIds.DEPENDENCY_UPDATER].DEPENDENCY_UPDATER]: 'Renovate'};
      default:
        throw new Error(`Unknown prompt id: ${id}`);
    }
  };
}
