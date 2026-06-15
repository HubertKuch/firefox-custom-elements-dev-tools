import { DevToolsClient } from './types';
import { ExtensionDevToolsClient } from './extension';
import { MockDevToolsClient } from './mock';

export * from './types';
export * from './extension';
export * from './mock';

export const getDevToolsClient = (): DevToolsClient => {
  const isExtension = !!(window.chrome && window.chrome.runtime && window.chrome.runtime.id && window.chrome.devtools);
  const isBrowser = !!(window.browser && window.browser.runtime && window.browser.runtime.id && window.browser.devtools);
  
  if (isExtension || isBrowser) {
    return new ExtensionDevToolsClient();
  }
  
  return new MockDevToolsClient();
};
