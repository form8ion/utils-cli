import {lift} from '@form8ion/lift-javascript';
import {javascriptConfigs} from '../common';

export async function javascript(options) {
  await lift({...options, configs: javascriptConfigs});
}
