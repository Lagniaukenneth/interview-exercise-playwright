import { Page, Locator, expect } from "@playwright/test";

export class BolPage {
  readonly page: Page;
  readonly cookiesButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly checkoutLink: Locator;
  readonly productTitles: Locator;
  readonly screenReaderPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cookiesButton = page.getByRole("button", { name: "Alles accepteren" }); // Leave Dutch if site is Dutch
    this.searchInput = page.locator('[data-test="search_input_trigger"]');
    this.searchButton = page.locator('[data-test="search-button"]');
    this.checkoutLink = page
      .getByRole("link", { name: "Naar de kassa" })
      .first();
    this.productTitles = page.locator(
      'a[data-bltgh*="ProductList_Middle."] h2'
    );
    this.screenReaderPrices = page.locator("span", {
      hasText: /^De prijs van dit product is/,
    });
  }

  async goto() {
    await this.page.goto("https://www.bol.com/");
  }

  async acceptCookies() {
    await this.cookiesButton.click();
  }

  async searchProduct(product: string) {
    await this.searchInput.click();
    await this.searchInput.fill(product);
    await this.searchInput.press("Enter");
  }

  async clickSearchButton() {
    await this.searchButton.click();
  }

  async goToCheckout() {
    await this.checkoutLink.click();
  }

  async expectSearchInputVisible() {
    await expect(this.searchInput).toBeVisible();
  }

  async expectFirstPriceVisibleAndFormattedCorrectly() {
    const price = this.screenReaderPrices.first();
    await price.waitFor({ state: "visible" });
    await expect(price).toHaveText(/€\s?\d+,\d{2}/);
  }

  async expectAllPricesToBeFormattedCorrectly(maxToCheck: number = 5) {
    const count = await this.screenReaderPrices.count();

    for (let i = 0; i < Math.min(count, maxToCheck); i++) {
      const price = this.screenReaderPrices.nth(i);
      await price.waitFor({ state: "visible" });
      await expect(price).toHaveText(/€\s?\d+,\d{2}/);
    }
  }

  getProductTitleByName(title: string): Locator {
    return this.page.getByRole("link", { name: title });
  }

  async expectProductTitleVisible(title: string) {
    const productTitle = this.getProductTitleByName(title);
    await productTitle.waitFor({ state: "visible" });
    await expect(productTitle).toBeVisible();
  }

  async expectAtLeastOneProductTitleVisible() {
    const count = await this.productTitles.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const title = this.productTitles.nth(i);
      await expect(title).toBeVisible();

      const text = await title.textContent();
      expect(text?.trim().length).toBeGreaterThan(5);
    }
  }

  async expectNumberOfPriceSpansEqualsNumberOfTitles() {
    await this.productTitles.first().waitFor({ state: "visible" });
    await this.screenReaderPrices.first().waitFor({ state: "attached" });

    const titleCount = await this.productTitles.count();
    const priceCount = await this.screenReaderPrices.count();
  }

  async expectEachProductCardHasTitleAndPrice() {
    const productCards = this.page.locator("div.relative.grid");

    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const card = productCards.nth(i);

      const title = card.locator("h2");
      const price = card.locator("span", {
        hasText: /^De prijs van dit product is/,
      });

      const hasTitle = (await title.count()) > 0;
      const hasPrice = (await price.count()) > 0;

      expect(hasTitle).toBeTruthy();
      expect(hasPrice).toBeTruthy();
    }
  }

  async firstProductNewTab() {
    const firstProduct = this.page.locator('a[target="_blank"]').first();

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      firstProduct.click(),
    ]);

    await newPage.waitForLoadState();

    return newPage;
  }
}
