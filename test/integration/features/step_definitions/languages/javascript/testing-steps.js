import {promises as fs} from 'fs';
import {fileExists} from '@form8ion/core';
import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('mocha has been configured for unit tests', async function () {
  assert.isTrue(await fileExists(`${process.cwd()}/src/canary-test.js`));
  assert.deepEqual(
    JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8')).scripts['test:unit:base'],
    'DEBUG=any mocha \'src/**/*-test.js\''
  );
});
