import {directoryExists} from '@form8ion/core';

import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('github-workflows is defined as the ci provider', async function () {
  assert.isTrue(await directoryExists(`${this.projectRoot}/.github/workflows`));
});
