browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse({ status: "received" });
});
