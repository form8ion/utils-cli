import {scaffold as scaffoldJavaScript} from '@travi/javascript-scaffolder';
import {scaffold as scaffoldTravisForJavaScript} from '@travi/travis-scaffolder-javascript';
import {prompt} from '@travi/github-scaffolder';
import {scaffold as scaffoldHapi} from '@form8ion/hapi-scaffolder';
import {scaffold as scaffoldRemarkPlugin} from '@form8ion/remark-plugin-scaffolder';

export function javascript(options) {
  return scaffoldJavaScript({
    ...options,
    configs: {
      eslint: {scope: '@form8ion'},
      remark: '@form8ion/remark-lint-preset',
      babelPreset: {name: '@form8ion', packageName: '@form8ion/babel-preset'},
      commitlint: {name: '@form8ion', packageName: '@form8ion/commitlint-config'}
    },
    overrides: {npmAccount: 'form8ion'},
    ciServices: {Travis: {scaffolder: scaffoldTravisForJavaScript, public: true}},
    applicationTypes: {Hapi: {scaffolder: scaffoldHapi}},
    packageTypes: {'Remark Plugin': {scaffolder: scaffoldRemarkPlugin}}
  });
}

export function githubPrompt() {
  return prompt({account: 'form8ion'});
}
