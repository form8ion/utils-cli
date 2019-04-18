import {scaffold as scaffoldJavaScript} from '@travi/javascript-scaffolder';
import {scaffold as scaffoldTravisForJavaScript} from '@travi/travis-scaffolder-javascript';
import {prompt} from '@travi/github-scaffolder';

export function javascript(options) {
  return scaffoldJavaScript({
    ...options,
    ciServices: {Travis: {scaffolder: scaffoldTravisForJavaScript, public: true}}
  });
}

export function githubPrompt() {
  return prompt({account: 'form8ion'});
}
