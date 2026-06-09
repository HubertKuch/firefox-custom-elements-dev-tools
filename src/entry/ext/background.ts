import browser from 'webextension-polyfill';
import { buildCustomElementTree, getElementPropertiesByPath } from '../../utils/finder';

browser.runtime.onMessage.addListener((message: any) => {
  console.log('Message received in background:', message);
  
  if (message.type === 'executeScript') {
    return browser.scripting.executeScript({
      target: { tabId: message.tabId },
      func: buildCustomElementTree,
      world: 'MAIN' as any // Access page-side JS
    }).then(results => {
      console.log('Script results (tree):', results);
      return results;
    }).catch(error => {
      console.error('Script execution failed in background:', error);
      throw error;
    });
  }

  if (message.type === 'getProperties') {
    return browser.scripting.executeScript({
      target: { tabId: message.tabId },
      func: getElementPropertiesByPath,
      args: [message.path],
      world: 'MAIN' as any // Access page-side JS
    }).then(results => {
      console.log('Script results (properties):', results);
      if (results && results[0]) {
          return results[0].result;
      }
      return [];
    }).catch(error => {
      console.error('Property fetch failed in background:', error);
      return [];
    });
  }

  return Promise.resolve({ status: "received" });
});


