import * as mochaPlugin from '@form8ion/mocha-scaffolder';
import * as vitestPlugin from '@form8ion/vitest';

import {describe, expect, it} from 'vitest';

import {unitTestFrameworks} from './test-frameworks.js';

describe('common test frameworks', () => {
  it('should define the unit test frameworks', () => {
    expect(unitTestFrameworks).toEqual({
      mocha: mochaPlugin,
      vitest: vitestPlugin
    });
  });
});
