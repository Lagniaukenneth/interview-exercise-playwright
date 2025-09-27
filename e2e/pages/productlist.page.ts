import { Page, Locator, Expect } from "@playwright/test";

export class ProductListPage {
  readonly productAnchorLocator: Locator;
  readonly pageNavigator: Locator;

  constructor(private page: Page) {
    this.page = page;
    this.pageNavigator = page.getByRole('link', { name: 'ga naar pagina 2' })
    this.productAnchorLocator = page.locator('a[data-bltgh$="ProductTitle"]');
  }

  async getAllTitles() {
    const titles = await this.productAnchorLocator.allTextContents();
    return titles;
  }

  async navigateToPage2() {
    await this.pageNavigator.click();
  }
}
