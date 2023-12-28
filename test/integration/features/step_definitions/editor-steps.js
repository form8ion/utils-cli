import {promises as fs} from 'node:fs';
import os from 'node:os';

import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Given('a JetBrains IDE is in use', async function () {
  this.editor = 'JetBrains';
});

Then('runConfigurations are prevented from being ignored', async function () {
  const gitIgnoreContents = await fs.readFile(`${process.cwd()}/.gitignore`, 'utf-8');
  const gitIgnoreLines = gitIgnoreContents.split(os.EOL);

  assert.includeOrderedMembers(gitIgnoreLines, ['.idea', '!.idea/', '.idea/*', '!.idea/runConfigurations/']);
});
