import {promises as fs} from 'fs';
import {fileExists} from '@form8ion/core';
import camelcase from 'camelcase';

import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import {dialects} from '@form8ion/javascript-core';

Given('the project will use the {string} dialect', async function (dialect) {
  this.dialect = dialect;

  if (dialect === dialects.ESM) this.unitTestFramework = 'vitest';
});

Then('the package will have typescript configured', async function () {
  const tsconfig = JSON.parse(await fs.readFile(`${process.cwd()}/tsconfig.json`, 'utf-8'));

  assert.equal(tsconfig.extends, '@form8ion/tsconfig');
});

Then('transpilation will be configured', async function () {
  assert.isTrue(await fileExists(`${process.cwd()}/.babelrc.json`));
});

Then('ESM details are configured for the project', async function () {
  const [packageJsonContents, exampleContents] = await Promise.all([
    fs.readFile(`${process.cwd()}/package.json`, 'utf-8'),
    fs.readFile(`${process.cwd()}/example.js`, 'utf-8')
  ]);
  const {type} = JSON.parse(packageJsonContents);

  assert.equal(type, 'module');
  assert.include(exampleContents, `import ${camelcase(this.projectName)} from './lib/index.js';`);
  assert.isTrue(await fileExists(`${process.cwd()}/rollup.config.js`));
});
