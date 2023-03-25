import * as js from '@form8ion/javascript';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {unitTesting} from './enhanced-scaffolders.js';
import {unitTestFrameworks} from '../common/test-frameworks.js';

describe('enhanced lift scaffolders', () => {
  beforeEach(() => {
    vi.mock('@form8ion/javascript');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should provide the frameworks to the unit test framework scaffolder', async () => {
    const results = any.simpleObject();
    const options = any.simpleObject();
    when(js.scaffoldUnitTesting).calledWith({...options, frameworks: unitTestFrameworks}).mockResolvedValue(results);

    expect(await unitTesting(options)).toEqual(results);
  });
});
