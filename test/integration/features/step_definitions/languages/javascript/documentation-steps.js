import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import {fileExists} from '@form8ion/core';

Then('the example file is initialized', async function () {
  assert.isTrue(await fileExists(`${process.cwd()}/example.js`));
});
