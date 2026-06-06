import browser from 'webextension-polyfill';

browser.devtools.panels.create(
  "Custom Elements",
  "icon.png",
  "panel.html"
);
