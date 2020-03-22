import {lift} from '@form8ion/lift';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';

export function handler() {
  return lift({Renovate: scaffoldRenovate});
}

export const command = 'lift';
export const describe = 'Lift an existing project with additional functionality';
