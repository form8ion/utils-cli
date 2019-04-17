import {scaffold as scaffoldJavaScript} from '@travi/javascript-scaffolder';
import {scaffold as scaffoldTravisForJavaScript} from '@travi/travis-scaffolder-javascript';

export function javascript(options) {
  return scaffoldJavaScript({
    ...options,
    ciServices: {Travis: {scaffolder: scaffoldTravisForJavaScript, public: true}}
  });
}
