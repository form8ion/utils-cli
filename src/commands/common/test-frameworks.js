import * as mochaPlugin from '@form8ion/mocha-scaffolder';
import * as vitestPlugin from '@form8ion/vitest';
import * as cucumberPlugin from '@form8ion/cucumber-scaffolder';

export const unitTestFrameworks = {
  mocha: mochaPlugin,
  vitest: vitestPlugin
};

export const integrationTestFrameworks = {
  cucumber: cucumberPlugin
};
