import {lift} from '@form8ion/lift-javascript';
import {javascriptConfigs} from '../common';

export function javascript(options) {
  return lift({...options, configs: javascriptConfigs});
}
