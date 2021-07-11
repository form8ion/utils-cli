import {promises as fs} from 'fs';
import {load} from 'js-yaml';
import {fileExists} from '@form8ion/core';
import {Before, Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import any from '@travi/any';
import td from 'testdouble';

function versionSegment() {
  return any.integer({max: 20});
}

const majorVersion = versionSegment();

function semverStringFactory() {
  return `v${majorVersion}.${versionSegment()}.${versionSegment()}`;
}

let questionNames;

Before(function () {
  questionNames = require('@form8ion/project').questionNames;
});

Given(/^the project language should be JavaScript$/, async function () {
  this.setAnswerFor(questionNames.PROJECT_LANGUAGE, 'JavaScript');
  const huskyVersionError = new Error();
  huskyVersionError.stdout = JSON.stringify({});
  huskyVersionError.command = 'npm ls husky --json';
  huskyVersionError.exitCode = 1;

  td.when(this.execa('npm run generate:md && npm test', {shell: true})).thenReturn({stdout: {pipe: () => undefined}});
  td.when(this.execa('npm', ['whoami'])).thenResolve(any.word());
  td.when(this.execa('npm', ['ls', 'husky', '--json'])).thenReject(huskyVersionError);
});

Given(/^nvm is properly configured$/, function () {
  const latestLtsVersion = semverStringFactory();

  td.when(this.execa('. ~/.nvm/nvm.sh && nvm ls-remote --lts', {shell: true}))
    .thenResolve({stdout: [...any.listOf(semverStringFactory), latestLtsVersion, ''].join('\n')});
  td.when(this.execa('. ~/.nvm/nvm.sh && nvm install', {shell: true})).thenReturn({stdout: {pipe: () => undefined}});
});

Then(/^JavaScript ignores are defined$/, async function () {
  const gitIgnore = await fs.readFile(`${process.cwd()}/.gitignore`);

  assert.equal(gitIgnore.toString(), `/node_modules/
/lib/
/coverage/
/.nyc_output/

.eslintcache`);
});

Then(/^the core JavaScript files are present$/, async function () {
  const config = load(await fs.readFile(`${process.cwd()}/.eslintrc.yml`));

  assert.isTrue(await fileExists(`${process.cwd()}/package.json`));
  assert.deepEqual(config.extends, ['@form8ion', '@form8ion/mocha']);
});
