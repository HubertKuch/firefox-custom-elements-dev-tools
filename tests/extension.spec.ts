import { test as base, expect, chromium, type ChromiumBrowserContext } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const test = base.extend<{
  context: ChromiumBrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    const pathToExtension = path.resolve(__dirname, '../dist');
    
    if (!fs.existsSync(pathToExtension)) {
      throw new Error(`Extension build directory not found at ${pathToExtension}. Run 'npm run build' first.`);
    }

    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--headless=new`,
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) {
      background = await context.waitForEvent('serviceworker');
    }
    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

test.describe('E2E Extension Integration', () => {
  test('should inspect, highlight, and modify custom elements in real DOM', async ({ page, context, extensionId }) => {
    const targetPage = await context.newPage();
    targetPage.on('console', msg => console.log('PAGE LOG:', msg.text()));
    targetPage.on('pageerror', err => console.error('PAGE ERROR:', err.message));
    
    const testTargetUrl = `http://localhost:5173/tests/test-target.html`;
    await targetPage.goto(testTargetUrl);
    await targetPage.waitForSelector('custom-button');

    let [background] = context.serviceWorkers();
    if (!background) {
      background = await context.waitForEvent('serviceworker');
    }
    
    const targetTabId = await background.evaluate(async (url) => {
      const tabs = await chrome.tabs.query({ url });
      return tabs[0]?.id;
    }, testTargetUrl);

    expect(targetTabId).toBeDefined();

    const panelPage = await context.newPage();
    panelPage.on('console', msg => console.log('PANEL LOG:', msg.text()));
    panelPage.on('pageerror', err => console.error('PANEL ERROR:', err.message));
    
    await panelPage.addInitScript((tabId) => {
      (window as any).chrome = (window as any).chrome || {};
      (window as any).chrome.devtools = {
        inspectedWindow: {
          tabId: tabId
        }
      };
    }, targetTabId);

    await panelPage.goto(`chrome-extension://${extensionId}/panel.html`);

    const treeView = panelPage.locator('.font-mono');
    await expect(treeView.first()).toBeVisible({ timeout: 10000 });

    await expect(panelPage.locator('text=test-container').first()).toBeVisible();
    await expect(panelPage.locator('text=custom-button').first()).toBeVisible();

    const buttonNode = panelPage.locator('text=custom-button').first();
    await buttonNode.hover();

    const overlay = targetPage.locator('#go-wasm-devtools-highlight-overlay');
    await expect(overlay).toBeVisible();
    
    const bg = await overlay.evaluate(el => window.getComputedStyle(el).backgroundColor);
    const border = await overlay.evaluate(el => window.getComputedStyle(el).border);
    expect(bg).toContain('rgba(135, 206, 250');
    expect(border).toContain('2px solid rgba(30, 144, 255, 0.7)');

    await panelPage.locator('text=test-container').first().hover();
    await panelPage.mouse.move(0, 0);
    await expect(overlay).toBeHidden();

    await buttonNode.click();

    const sidebar = panelPage.locator('text=Attributes');
    await expect(sidebar).toBeVisible();

    const attributeVal = panelPage.locator('span.cursor-text').first();
    await attributeVal.dblclick();

    const input = panelPage.locator('input[type="text"]');
    await expect(input).toBeVisible();
    await input.fill('submit');
    await input.press('Enter');

    const realButton = targetPage.locator('custom-button');
    await expect(realButton).toHaveAttribute('role', 'submit');

    await expect(panelPage.locator('span.cursor-text').first()).toHaveText('"submit"');
  });
});
