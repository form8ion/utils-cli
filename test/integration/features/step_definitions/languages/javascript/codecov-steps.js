import {Before, Then, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';

import {stubbedNodeModules} from '../../common-steps.js';
import {assertGroupContainsBadge} from '../../documentation-steps.js';

let lift, liftQuestionNames;

Before(async function () {
  ({questionNames: liftQuestionNames} = await import('@form8ion/lift'));
  ({handler: lift} = (await import('../../../../../../src/commands/lift/command.js')));
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
