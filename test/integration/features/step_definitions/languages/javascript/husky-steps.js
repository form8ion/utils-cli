import {fileExists} from '@form8ion/core';

import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import * as td from 'testdouble';

export function setupMissingHusky(execa) {
  const huskyVersionError = new Error();
  huskyVersionError.stdout = JSON.stringify({});
  huskyVersionError.command = 'npm ls husky --json';
  huskyVersionError.exitCode = 1;

  td.when(execa('npm', ['ls', 'husky', '--json']))
    .thenReject(huskyVersionError);
}

Then('husky is configured', async function () {
  assert.isTrue(await fileExists(`${process.cwd()}/.husky/pre-commit`));
  assert.isTrue(await fileExists(`${process.cwd()}/.husky/commit-msg`));
});
