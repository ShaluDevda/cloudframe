class GlobalFeedPage {
  constructor(page) {
    this.page = page;
    this.globalFeedTab = page.locator('text=Global Feed');
    this.articlePreviews = page.locator('.article-preview');
    this.popularTags = page.locator('.tag-list');
    this.tagItem = tag => page.locator(`.tag-pill:has-text("${tag}")`);
    this.articleTitle = page.locator('.preview-link h1');
    this.authorLink = page.locator('.article-preview .author');
  }

  async goto() {
    await this.page.goto('https://demo.realworld.io/#/');
  }

  async clickTag(tag) {
    await this.tagItem(tag).click();
  }

  async clickArticleTitle(index = 0) {
    await this.articleTitle.nth(index).click();
  }

  async clickAuthor(index = 0) {
    await this.authorLink.nth(index).click();
  }
}

export  { GlobalFeedPage };
