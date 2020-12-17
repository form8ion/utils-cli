import {promises} from 'fs';
import {exists} from 'mz/fs';
import {Before, Given, Then} from 'cucumber';
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
  questionNames = require('@travi/project-scaffolder').questionNames;

  this.shell.exec = td.func();
});

Given(/^the project language should be JavaScript$/, async function () {
  this.setAnswerFor(questionNames.PROJECT_TYPE, 'JavaScript');

  td.when(this.shell.exec('npm run generate:md && npm test', {silent: false})).thenCallback(0);
  td.when(this.execa('npm', ['whoami'])).thenResolve(any.word());
  td.when(this.execa('npm', ['ls', 'husky', '--json'])).thenResolve({stdout: JSON.stringify({})});
});

Given(/^nvm is properly configured$/, function () {
  const latestLtsVersion = semverStringFactory();

  td.when(this.shell.exec('. ~/.nvm/nvm.sh && nvm ls-remote --lts', {silent: true}))
    .thenCallback(0, [...any.listOf(semverStringFactory), latestLtsVersion, ''].join('\n'));
  td.when(this.shell.exec('. ~/.nvm/nvm.sh && nvm install', {silent: false})).thenCallback(0);
});

Then(/^JavaScript ignores are defined$/, async function () {
  const gitIgnore = await promises.readFile(`${process.cwd()}/.gitignore`);

  assert.equal(gitIgnore.toString(), `/node_modules/
/lib/
/coverage/
/.nyc_output/

.eslintcache`);
});

Then(/^the core JavaScript files are present$/, async function () {
  assert.isTrue(await exists(`${process.cwd()}/package.json`));
});
