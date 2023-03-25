import {scaffold as scaffoldMocha} from '@form8ion/mocha-scaffolder';
import {scaffold as scaffoldVitest} from '@form8ion/vitest';

import {describe, expect, it} from 'vitest';

import {unitTestFrameworks} from './test-frameworks.js';

describe('common test frameworks', () => {
  it('should define the unit test frameworks', () => {
    expect(unitTestFrameworks).toEqual({
      mocha: {scaffolder: scaffoldMocha},
      vitest: {scaffolder: scaffoldVitest}
    });
  });
});
