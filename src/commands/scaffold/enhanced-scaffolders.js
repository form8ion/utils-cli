import {scaffold as scaffoldJavaScript} from '@form8ion/javascript';
import {javascriptConfigs} from '../common/javascript-configs.js';
import {getJavascriptPlugins} from '../common/javascript-plugins.js';

export function javascriptScaffolderFactory(decisions) {
  return options => scaffoldJavaScript({
    ...options,
    configs: javascriptConfigs,
    plugins: getJavascriptPlugins(),
    decisions
  });
}
