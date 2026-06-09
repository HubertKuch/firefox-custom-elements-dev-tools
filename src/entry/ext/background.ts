import browser from 'webextension-polyfill';
import { buildCustomElementTree } from '../../utils/finder';

browser.runtime.onMessage.addListener((message: any) => {
  console.log('Message received in background:', message);
  
  if (message.type === 'executeScript') {
    return browser.scripting.executeScript({
      target: { tabId: message.tabId },
      func: buildCustomElementTree
    }).then(results => {
      console.log('Script results:', results);
      return results;
    }).catch(error => {
      console.error('Script execution failed in background:', error);
      throw error;
    });
  }
  return Promise.resolve({ status: "received" });
});


