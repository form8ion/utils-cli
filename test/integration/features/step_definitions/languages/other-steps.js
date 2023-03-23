import {fileExists} from '@form8ion/core';
import {Before, Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';

let questionNames;

Before(async () => {
  ({questionNames} = (await import('@form8ion/project')));
});

Given(/^the project language should be Other$/, async function () {
  this.setAnswerFor(questionNames.PROJECT_LANGUAGE, 'Other');
});

Then(/^core ignores are defined$/, async function () {
  assert.isTrue(await fileExists(`${process.cwd()}/.editorconfig`));
  assert.isTrue(await fileExists(`${process.cwd()}/README.md`));
});
