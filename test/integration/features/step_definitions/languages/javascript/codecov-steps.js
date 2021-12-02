import {Before, Then, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import importFresh from 'import-fresh';

import {stubbedNodeModules} from '../../common-steps';

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
`
  });

  await lift({decisions: {[liftQuestionNames.SCAFFOLDER]: 'General Maintenance'}});
});

Then('the coverage badge is added to the readme', async function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});
