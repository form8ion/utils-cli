import {promises as fs} from 'fs';
import {fileExists} from '@form8ion/core';
import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Given('the project will use the {string} dialect', async function (dialect) {
  this.dialect = dialect;
});

Then('the package will have typescript configured', async function () {
  const tsconfig = JSON.parse(await fs.readFile(`${process.cwd()}/tsconfig.json`, 'utf-8'));

  assert.equal(tsconfig.extends, '@form8ion/tsconfig');
});

Then('transpilation will be configured', async function () {
  assert.isTrue(await fileExists(`${process.cwd()}/.babelrc`));
});
