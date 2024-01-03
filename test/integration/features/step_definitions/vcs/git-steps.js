import {promises} from 'fs';
import * as td from 'testdouble';
import {fileExists} from '@form8ion/core';
import {Before, Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import {promises as fs} from 'node:fs';
import os from 'node:os';

let questionNames;

const simpleGitInstance = td.object(['checkIsRepo', 'listRemote', 'remote', 'addRemote', 'init']);

Before(async () => {
  ({questionNames} = (await import('@form8ion/project')));
});

Given(/^the project should be versioned in git$/, async function () {
  this.setAnswerFor(questionNames.GIT_REPO, true);

  td.when(this.git.simpleGit(process.cwd())).thenReturn(simpleGitInstance);
  td.when(simpleGitInstance.checkIsRepo('root')).thenResolve(false);
  td.when(simpleGitInstance.listRemote()).thenResolve([]);
});

Given(/^the project should not be versioned in git$/, async function () {
  this.setAnswerFor(questionNames.GIT_REPO, false);
});

Given('the repository is initialized', async function () {
  td.when(this.git.simpleGit(process.cwd())).thenReturn(simpleGitInstance);
  td.when(simpleGitInstance.checkIsRepo('root')).thenResolve(true);
  td.when(simpleGitInstance.listRemote()).thenResolve(['origin']);
  td.when(simpleGitInstance.remote(['get-url', 'origin']))
    .thenResolve(`git@github.com:${this.repoOwner}/${this.repoName}.git`);
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

Then('existing vcs ignores remain', async function () {
  const gitIgnoreContents = await fs.readFile(`${process.cwd()}/.gitignore`, 'utf-8');
  const gitIgnoreLines = gitIgnoreContents.split(os.EOL);

  assert.includeOrderedMembers(gitIgnoreLines, this.existingGitIgnores);
});
