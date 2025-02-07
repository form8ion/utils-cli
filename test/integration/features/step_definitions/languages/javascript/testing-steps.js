import {promises as fs} from 'fs';
import {fileExists} from '@form8ion/core';
import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import {assertDevDependencyIsInstalled} from './javascript-steps.js';

Then('mocha has been configured for unit tests', async function () {
  assert.isTrue(await fileExists(`${process.cwd()}/src/canary-test.js`));
  assert.deepEqual(
    JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8')).scripts['test:unit:base'],
    'DEBUG=any mocha \'src/**/*-test.js\''
  );
});

Then('vitest has been configured for unit tests', async function () {
  assert.isTrue(await fileExists(`${process.cwd()}/src/canary.test.js`));
  assert.deepEqual(
    JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8')).scripts['test:unit:base'],
    'DEBUG=any vitest run'
  );
});

Then('integration testing is configured', async function () {
  assert.deepEqual(
    JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8')).scripts['test:integration'],
    'run-s \'test:integration:base -- --profile noWip\''
  );
  assert.deepEqual(
    JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8')).scripts['test:integration:base'],
    'NODE_OPTIONS=--enable-source-maps DEBUG=any cucumber-js test/integration'
  );
  assert.deepEqual(
    JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8')).scripts['pretest:integration:base'],
    'run-s build'
  );
  assertDevDependencyIsInstalled(this.execa, '@cucumber/cucumber');
  assert.isTrue(await fileExists(`${process.cwd()}/test/integration/features/step_definitions/common-steps.js`));
});
