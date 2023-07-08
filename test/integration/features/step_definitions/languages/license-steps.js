import {promises as fs} from 'node:fs';

import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('the license should have been created', async function () {
  const licenseContent = await fs.readFile(`${process.cwd()}/LICENSE`, 'utf-8');

  assert.include(licenseContent, 'Copyright (c) 2000 Matt Travi');
});
