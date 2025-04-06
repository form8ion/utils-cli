import {scaffoldUnitTesting} from '@form8ion/javascript';
import {scaffold as codecovScaffolder} from '@form8ion/codecov';

import {unitTestFrameworks} from '../common/test-frameworks.js';

export function unitTesting(options) {
  return scaffoldUnitTesting({...options, frameworks: unitTestFrameworks});
}

export function getEnhancedCodecovScaffolder() {
  return options => codecovScaffolder({
    ...options,
    visibility: 'Public'
  });
}
