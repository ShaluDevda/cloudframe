const { test, expect } = require('@playwright/test');
const { GlobalFeedPage } = require('../pages/globalFeedPage');

test.describe('Global Feed Page Tests', () => {
  let feedPage;

  test.beforeEach(async ({ page }) => {
    feedPage = new GlobalFeedPage(page);
    await feedPage.goto();
  });

  test('Should load Global Feed with articles', async () => {
    await expect(feedPage.globalFeedTab).toBeVisible();
    const count = await feedPage.articlePreviews.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Each article should display title, author, and tags', async () => {
    const firstArticle = feedPage.articlePreviews.nth(0);
    await expect(firstArticle.locator('.preview-link h1')).toBeVisible();
    await expect(firstArticle.locator('.author')).toBeVisible();
    await expect(firstArticle.locator('.tag-list')).toBeVisible();
  });

  test('Clicking article title should navigate to full article view', async ({ page }) => {
    await feedPage.clickArticleTitle(0);
    await expect(page).toHaveURL(/#\/article\//);
  });

  test('Clicking author name should navigate to profile page', async ({ page }) => {
    await feedPage.clickAuthor(0);
    await expect(page).toHaveURL(/#\/@/);
  });

  test('Popular tags should be visible', async () => {
    await expect(feedPage.popularTags).toBeVisible();
  });

  test('Clicking a tag should filter articles by that tag', async () => {
    await feedPage.clickTag('javascript');
    await expect(feedPage.globalFeedTab).not.toBeVisible(); // Tag feed replaces global feed
    const count = await feedPage.articlePreviews.count();
    expect(count).toBeGreaterThan(0);
  });
});
