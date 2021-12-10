import {Before, Then, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import importFresh from 'import-fresh';

import {stubbedNodeModules} from '../../common-steps';
import {assertGroupContainsBadge} from '../../documentation-steps';

let lift, liftQuestionNames;

Before(function () {
  ({questionNames: liftQuestionNames} = require('@form8ion/lift'));
  lift = importFresh('../../../../../../src/commands/lift/command').handler;
});

When('codecov is configured for an existing project', async function () {
  stubbedFs({
    node_modules: stubbedNodeModules,
    'README.md': `# project-name

<!--status-badges start -->
<!--status-badges end -->

<!--consumer-badges start -->
<!--consumer-badges end -->

<!--contribution-badges start -->
<!--contribution-badges end -->
`
  });

  await lift({decisions: {[liftQuestionNames.SCAFFOLDER]: 'Codecov'}});
});

Then('the coverage badge is added to the readme', async function () {
  const {repoName, repoOwner, visibility} = this;

  if ('Public' === visibility) {
    await assertGroupContainsBadge(
      {
        image: `https://img.shields.io/codecov/c/github/${repoOwner}/${repoName}?logo=codecov`,
        link: `https://codecov.io/github/${repoOwner}/${repoName}`,
        name: 'coverage'
      },
      'status',
      process.cwd()
    );
  }
});
