import browser from 'webextension-polyfill';

browser.runtime.onMessage.addListener((message: any, sender: any) => {
  return Promise.resolve({ status: "received" });
});
