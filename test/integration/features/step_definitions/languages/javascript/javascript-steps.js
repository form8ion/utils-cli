import {promises as fs} from 'fs';
import {load} from 'js-yaml';
import {fileExists} from '@form8ion/core';
import {Before, Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import any from '@travi/any';
import td from 'testdouble';
import {projectNameAnswer} from '../../common-steps';

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

  td.when(this.execa('npm run generate:md && npm test', {shell: true}))
    .thenReturn({stdout: {pipe: () => undefined}});
  td.when(this.execa('npm', ['whoami']))
    .thenResolve(any.word());
  td.when(this.execa('npm', ['ls', 'husky', '--json']))
    .thenReject(huskyVersionError);
});

Given(/^nvm is properly configured$/, function () {
  const latestLtsVersion = semverStringFactory();

  td.when(this.execa('. ~/.nvm/nvm.sh && nvm ls-remote --lts', {shell: true}))
    .thenResolve({stdout: [...any.listOf(semverStringFactory), latestLtsVersion, ''].join('\n')});
  td.when(this.execa('. ~/.nvm/nvm.sh && nvm install', {shell: true}))
    .thenReturn({stdout: {pipe: () => undefined}});
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

Then('the package will have repository details defined', async function () {
  assert.deepEqual(
    JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8')).repository,
    `form8ion/${projectNameAnswer}`
  );
});

Then('the project will have linting configured', async function () {
  assert.equal(load(await fs.readFile(`${process.cwd()}/.eslintrc.yml`, 'utf-8')).extends, '@form8ion');
  assert.include(
    JSON.parse(await fs.readFile(`${process.cwd()}/.remarkrc.json`, 'utf-8')).plugins,
    '@form8ion/remark-lint-preset'
  );
});

Then('the package will have linting configured', async function () {
  const {dialects} = require('@form8ion/javascript-core');
  const extendedEslintConfigs = load(await fs.readFile(`${process.cwd()}/.eslintrc.yml`, 'utf-8')).extends;

  assert.includeMembers(extendedEslintConfigs, ['@form8ion', '@form8ion/mocha']);
  if (dialects.TYPESCRIPT === this.dialect) {
    assert.include(extendedEslintConfigs, '@form8ion/typescript');
  }
  assert.include(
    JSON.parse(await fs.readFile(`${process.cwd()}/.remarkrc.json`, 'utf-8')).plugins,
    '@form8ion/remark-lint-preset'
  );
});

Then('npm is used for the package manager', async function () {
  td.verify(this.execa(td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && npm install')), {ignoreExtraArgs: true});
});
