/* eslint import/no-extraneous-dependencies: ['error', {'devDependencies': true}] */
import autoExternal from 'rollup-plugin-auto-external';
import json from 'rollup-plugin-json';
import executable from 'rollup-plugin-executable';

export default {
  input: 'src/index.js',
  plugins: [autoExternal(), json(), executable()],
  output: [{file: 'bin/form8ion-utils.js', format: 'cjs', sourcemap: true, banner: '#!/usr/bin/env node'}]
};
