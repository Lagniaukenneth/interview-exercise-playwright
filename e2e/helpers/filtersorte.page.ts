import { Page, Locator, expect } from "@playwright/test";

export class FilterSortPage {
  readonly page: Page;
  readonly filterButton: Locator;
  readonly sortButton: Locator;
  readonly checkBreadcrumb: Locator;
  readonly sortDropdown: Locator;
  readonly lowToHighOption: Locator;
  readonly priceSpans: Locator;

  constructor(page: Page) {
    this.page = page;
    this.filterButton = page.getByRole("link", { name: /Speelgoed \(\d+\)/ });
    this.sortButton = page.locator('[data-test="search_input_trigger"]');
    this.checkBreadcrumb = page.getByText("'lego' in Speelgoed");
    this.sortDropdown = page.locator('select[label="Sortering"]').first();
    this.priceSpans = page
      .locator("div.block span")
      .getByText(
        /^De prijs van dit product is '[0-9]+' euro en '[0-9]+' cent$/
      );
    this.lowToHighOption = page.getByRole("option", {
      name: "Prijs laag - hoog",
    });
  }

  async goto() {
    await this.page.goto("https://www.bol.com/");
  }

  async clickFilter() {
    await this.filterButton.click();
  }

  async breadcrumbVisible() {
    await expect(this.checkBreadcrumb).toBeVisible();
  }

  async sortDropdownMenu() {
    await this.sortDropdown.click();
  }

  async sortByPriceLowToHigh() {
    await this.sortDropdown.selectOption("PRICE_ASC");
    expect(this.sortDropdown).toHaveValue("PRICE_ASC");
  }

  async getAllProductPrices() {
    const texts = await this.priceSpans.allTextContents();
    const prices = this.matchAllPricesByText(texts);

    const filteredPrices = prices.filter((price) => !Number.isNaN(price));
    const firstThreePrices = filteredPrices.slice(0, 3);

    return firstThreePrices;
  }

  getAllPriceSpans() {
    return this.priceSpans;
  }

  private matchAllPricesByText(texts: string[]) {
    return texts.map((text) => {
      const extractTextFromSingleQuotes = /'([^']*)'/g;
      const match = [...text.matchAll(extractTextFromSingleQuotes)];

      if (!match) return null;

      const euro = match[0]?.[1];
      const cent = match[1]?.[1];
      const match2 = parseFloat(`${euro}.${cent?.padStart(2, "0")}`);

      return match2;
    });
  }
}
