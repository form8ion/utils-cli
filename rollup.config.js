/* eslint import/no-extraneous-dependencies: ['error', {'devDependencies': true}] */
import autoExternal from 'rollup-plugin-auto-external';
import json from '@rollup/plugin-json';
import executable from 'rollup-plugin-executable';
import nodeResolve from '@rollup/plugin-node-resolve';
import {codecovRollupPlugin} from '@codecov/rollup-plugin';

export default {
  input: 'src/index.js',
  plugins: [
    autoExternal(),
    json(),
    executable(),
    nodeResolve({mainFields: ['module']}),
    codecovRollupPlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: '@form8ion/utils-cli',
      uploadToken: process.env.CODECOV_TOKEN
    })
  ],
  external: ['source-map-support/register', 'yargs/helpers'],
  output: [{file: 'bin/form8ion-utils.js', format: 'esm', sourcemap: true, banner: '#!/usr/bin/env node'}]
};
