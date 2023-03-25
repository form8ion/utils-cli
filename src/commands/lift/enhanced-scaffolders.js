import {scaffoldUnitTesting} from '@form8ion/javascript';
import {unitTestFrameworks} from '../common/test-frameworks.js';

export function unitTesting(options) {
  return scaffoldUnitTesting({...options, frameworks: unitTestFrameworks});
}
