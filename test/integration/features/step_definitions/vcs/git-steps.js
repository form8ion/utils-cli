import {promises} from 'fs';
import {fileExists} from '@form8ion/core';
import {Before, Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
// import toml from '@iarna/toml';

let questionNames;

Before(() => {
  questionNames = require('@travi/project-scaffolder').questionNames;
});

Given(/^the project should be versioned in git$/, async function () {
  this.setAnswerFor(questionNames.GIT_REPO, true);
});

Given(/^the project should not be versioned in git$/, async function () {
  this.setAnswerFor(questionNames.GIT_REPO, false);
});

Then(/^the base git files should be present$/, async function () {
  const gitAttributes = await promises.readFile(`${process.cwd()}/.gitattributes`);

  assert.equal(gitAttributes, '* text=auto');
  // console.log(toml.parse(await readFile(`${process.cwd()}/.git/config`)))
  // assert.isTrue(gitDirectoryStats.isDirectory());
});

Then('the base git files should not be present', async function () {
  assert.isFalse(await fileExists(`${process.cwd()}/.git`));
  assert.isFalse(await fileExists(`${process.cwd()}/.gitattributes`));
  assert.isFalse(await fileExists(`${process.cwd()}/.gitignore`));
});
