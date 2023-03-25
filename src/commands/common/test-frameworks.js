import {scaffold as scaffoldMocha} from '@form8ion/mocha-scaffolder';
import {scaffold as scaffoldVitest} from '@form8ion/vitest';

export const unitTestFrameworks = {
  mocha: {scaffolder: scaffoldMocha},
  vitest: {scaffolder: scaffoldVitest}
};
