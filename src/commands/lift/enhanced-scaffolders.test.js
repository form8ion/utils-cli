import {scaffoldUnitTesting} from '@form8ion/javascript';
import {scaffold as scaffoldCodecov} from '@form8ion/codecov';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {getEnhancedCodecovScaffolder, unitTesting} from './enhanced-scaffolders.js';
import {unitTestFrameworks} from '../common/test-frameworks.js';

vi.mock('@form8ion/javascript');
vi.mock('@form8ion/codecov');

describe('enhanced lift scaffolders', () => {
  const options = any.simpleObject();
  const results = any.simpleObject();

  it('should provide the frameworks to the unit test framework scaffolder', async () => {
    when(scaffoldUnitTesting).calledWith({...options, frameworks: unitTestFrameworks}).thenResolve(results);

    expect(await unitTesting(options)).toEqual(results);
  });

  it('should set the visibility to `Public` for Codecov since all projects in this org are public', async () => {
    when(scaffoldCodecov).calledWith({...options, visibility: 'Public'}).thenResolve(results);

    expect(await getEnhancedCodecovScaffolder()(options)).toEqual(results);
  });
});
