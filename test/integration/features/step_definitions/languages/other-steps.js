import {fileExists} from '@form8ion/core';
import {Before, Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';

let projectPromptConstants;

Before(async () => {
  ({promptConstants: projectPromptConstants} = (await import('@form8ion/project')));
});

Given(/^the project language should be Other$/, async function () {
  const {PROJECT_LANGUAGE} = projectPromptConstants.questionNames[projectPromptConstants.ids.PROJECT_LANGUAGE];
  this.setAnswerFor(PROJECT_LANGUAGE, 'Other');
});

Given('the visibility of the project is {string}', async function (visibility) {
  this.visibility = visibility;
});

Then(/^core ignores are defined$/, async function () {
  assert.isTrue(await fileExists(`${process.cwd()}/.editorconfig`));
  assert.isTrue(await fileExists(`${process.cwd()}/README.md`));
});
