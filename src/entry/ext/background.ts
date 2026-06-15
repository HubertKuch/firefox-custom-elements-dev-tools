import browser from 'webextension-polyfill';
import { 
  buildCustomElementTree, 
  getElementPropertiesByPath, 
  setElementAttributeByPath, 
  setElementPropertyByPath,
  highlightElementByPath,
  clearElementHighlight
} from '../../utils/dom';

type MessageHandler = (message: any) => Promise<any>;

const messageHandlers: Record<string, MessageHandler> = {
  executeScript: (message) => {
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
  },

  getProperties: (message) => {
    return browser.scripting.executeScript({
      target: { tabId: message.tabId },
      func: getElementPropertiesByPath,
      args: [message.path],
      world: 'MAIN' as any
    }).then(results => {
      console.log('Script results (properties):', results);
      if (results && results[0]) {
          return results[0].result;
      }
      return {};
    }).catch(error => {
      console.error('Property fetch failed in background:', error);
      return {};
    });
  },

  setAttribute: (message) => {
    return browser.scripting.executeScript({
      target: { tabId: message.tabId },
      func: setElementAttributeByPath,
      args: [message.path, message.name, message.value],
      world: 'MAIN' as any
    }).then(results => {
      return results && results[0] ? results[0].result : false;
    }).catch(error => {
      console.error('Set attribute failed:', error);
      return false;
    });
  },

  setProperty: (message) => {
    return browser.scripting.executeScript({
      target: { tabId: message.tabId },
      func: setElementPropertyByPath,
      args: [message.path, message.name, message.value],
      world: 'MAIN' as any
    }).then(results => {
      return results && results[0] ? results[0].result : false;
    }).catch(error => {
      console.error('Set property failed:', error);
      return false;
    });
  },

  highlightElement: (message) => {
    return browser.scripting.executeScript({
      target: { tabId: message.tabId },
      func: highlightElementByPath,
      args: [message.path],
      world: 'MAIN' as any
    }).then(results => {
      return results && results[0] ? results[0].result : false;
    }).catch(error => {
      console.error('Highlight element failed:', error);
      return false;
    });
  },

  clearHighlight: (message) => {
    return browser.scripting.executeScript({
      target: { tabId: message.tabId },
      func: clearElementHighlight,
      world: 'MAIN' as any
    }).then(results => {
      return results && results[0] ? results[0].result : false;
    }).catch(error => {
      console.error('Clear highlight failed:', error);
      return false;
    });
  }
};

browser.runtime.onMessage.addListener((message: any) => {
  console.log('Message received in background:', message);
  
  const handler = messageHandlers[message.type];
  if (handler) {
    return handler(message);
  }

  return Promise.resolve({ status: "received" });
});


