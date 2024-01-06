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

  // cant use includeOrderedMembers here since it was decided to require the included members to begin the list in
  // https://github.com/chaijs/chai/issues/717#issuecomment-225452800
  assert.includeMembers(gitIgnoreLines, ['.idea', '!.idea/', '.idea/*', '!.idea/runConfigurations/']);
});
