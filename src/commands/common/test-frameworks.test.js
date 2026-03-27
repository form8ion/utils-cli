import * as mochaPlugin from '@form8ion/mocha-scaffolder';
import * as vitestPlugin from '@form8ion/vitest';
import * as cucumberPlugin from '@form8ion/cucumber-scaffolder';

import {describe, expect, it} from 'vitest';

import {unitTestFrameworks, integrationTestFrameworks} from './test-frameworks.js';

describe('common test frameworks', () => {
  it('should define the unit test frameworks', () => {
    expect(unitTestFrameworks).toEqual({
      mocha: mochaPlugin,
      vitest: vitestPlugin
    });
  });

  it('should define the integration test frameworks', async () => {
    expect(integrationTestFrameworks).toEqual({cucumber: cucumberPlugin});
  });
});
