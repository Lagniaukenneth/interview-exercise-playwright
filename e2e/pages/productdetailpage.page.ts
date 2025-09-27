import { Page, Locator, expect } from "@playwright/test";

export class PdpPage {
  readonly page: Page;
  readonly productDetailLink: Promise<string | null>;
  readonly firstProduct: Locator;
  readonly productAnchorLocator: Locator;
  readonly newTab: Locator;
  readonly checkOnTitle: Locator;
  readonly checkOnPrice: Locator;
  readonly checkOnAvailability: Locator;
  readonly checkAddToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productAnchorLocator = page.locator('a[data-bltgh$="ProductTitle"]');
    this.productDetailLink = this.productAnchorLocator
      .first()
      .getAttribute("href");
    this.firstProduct = this.productAnchorLocator.getByText(/^LEGO/).first();
    this.newTab = page.locator('a[target="_blank"]').first();
    this.checkOnTitle = page.locator('[data-test="title"]').first();
    this.checkOnPrice = page.locator('[data-test="price"]').first();
    this.checkOnAvailability = page
      .locator("span", { hasText: "Uiterlijk" })
      .first();
    this.checkAddToCartButton = page
      .locator('a[data-test="add-to-basket"]')
      .nth(2);
  }

  async goto() {
    await this.page.goto("https://www.bol.com/");
  }

  async clickFirstProduct() {
    await this.firstProduct.click();
  }

  async addTargetBlankAttribute() {
    await this.productAnchorLocator.first().evaluate((e) => {
      e.setAttribute("target", "_blank");
    });
  }
  async getProductLink() {
    return await this.productDetailLink;
  }

  async getPage() {
    return await this.page;
  }

  async isTitleVisible() {
    await expect(this.checkOnTitle).toContainText("LEGO");
  }

  async isPriceVisible() {
    await expect(this.checkOnPrice).toBeVisible();
  }

  async isAvailableVisible() {
    await expect(this.checkOnAvailability).toBeVisible();
  }

  async isAddToCartButtonVisible() {
    await expect(this.checkAddToCartButton).toBeVisible();
  }

  async clickToCartButton() {
    await this.checkAddToCartButton.click();
  }

  
}
