import { test, expect, Page } from "@playwright/test";
import { BolPage } from "../pages/homepage.page";
import { FilterSortPage } from "../helpers/filtersorte.page";
import { PdpPage } from "../pages/productdetailpage.page";
import { InterceptorPage } from "../helpers/interceptor.page";
import { ProductListPage } from "../pages/productlist.page";
import { WaitForResponsePage } from "../helpers/waitforresponse.page";

let page: Page;
let bolPage: BolPage;
let filterSortPage: FilterSortPage;
let pdpPage: PdpPage;
let interceptor: InterceptorPage;
let productlistPage: ProductListPage;
let waitForResponsePage: WaitForResponsePage;

test.describe("Assesment", () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    bolPage = new BolPage(page);
    filterSortPage = new FilterSortPage(page);
    pdpPage = new PdpPage(page);
    interceptor = new InterceptorPage(page);
    productlistPage = new ProductListPage(page);
    waitForResponsePage = new WaitForResponsePage(page);
    await page.goto("https://www.bol.com");
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("Navigate to the homepage of bol.com", async () => {
    await expect(page).toHaveURL("https://www.bol.com/nl/nl/");
  });

  test("Accept cookie banner", async () => {
    await bolPage.acceptCookies();
  });

  test('Verify search input is visible and search for "lego"', async () => {
    await bolPage.expectSearchInputVisible();
    await bolPage.searchProduct("lego");
    await bolPage.clickSearchButton();
    await expect(page).toHaveURL(/searchtext=lego/i);
    await page.screenshot({ path: "resultpage.png" });
  });

  test('Click on the "Speelgoed" filter', async () => {
    await filterSortPage.clickFilter();
  });

  test('Verify breadcrumb shows "lego in Speelgoed"', async () => {
    await filterSortPage.breadcrumbVisible();
  });

  test("Extract all product prices and verify they are sorted from low to high", async () => {
    await filterSortPage.sortDropdownMenu();
    await filterSortPage.sortByPriceLowToHigh();
    await waitForResponsePage.waitForBatchResponse();

    const prices = await filterSortPage.getAllProductPrices();
    const sortedPricesAsc = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sortedPricesAsc);
    expect(prices.length).toBeGreaterThanOrEqual(3);
    await page.screenshot({ path: "sortedpage.png" });
  });

  test('Verify result is with title"', async () => {
    const firstTitle = await bolPage.getProductTitleByName("LEGO").first();
    await expect(firstTitle).toBeVisible();
  });

  test("Verify prices are visible and formatted correctly", async () => {
    const prices = await filterSortPage.getAllProductPrices();
    expect(prices.length).toBeGreaterThanOrEqual(1);
    const getAllPriceSpans = filterSortPage.getAllPriceSpans();
  });

  test("Click on the first product, opens in new tab", async () => {
    await pdpPage.clickFirstProduct();
  });

  test("Check title is visible", async () => {
    expect(await pdpPage.firstProduct).not.toBeNull();
    await pdpPage.isTitleVisible();
  });

  test("Check price is visible", async () => {
    expect(await pdpPage.firstProduct).not.toBeNull();
    await pdpPage.isPriceVisible();
  });

  test("Check product availability is visible", async () => {
    expect(await pdpPage.firstProduct).not.toBeNull();
    await pdpPage.isAvailableVisible();
  });

  test('Check "Add to cart" button is visible', async () => {
    await pdpPage.isAddToCartButtonVisible();
  });

  test("Click Add to Cart but block cart request", async ({ page }) => {
    await page.route("**/order/basket/addItems.html**", (route) => {
      route.abort();
    });

    await interceptor.blockAddToCartRequests();
    await page.screenshot({ path: "before-add-to-cart.png" });
    await pdpPage.clickToCartButton();
    await page.screenshot({ path: "after-add-to-cart.png" });
  });

  test.describe("Pagination Test", () => {
    test.beforeAll(async ({ browser }) => {
      const context = await browser.newContext();
      page = await context.newPage();
      bolPage = new BolPage(page);
      filterSortPage = new FilterSortPage(page);
      pdpPage = new PdpPage(page);
      interceptor = new InterceptorPage(page);
      productlistPage = new ProductListPage(page);
      await page.goto("https://www.bol.com");
    });

    test.afterAll(async () => {
      await page.close();
    });

    test("Navigate to the homepage of bol.com", async () => {
      await expect(page).toHaveURL("https://www.bol.com/nl/nl/");
    });

    test("Accept cookie banner", async () => {
      await bolPage.acceptCookies();
    });

    test('Verify search input is visible and search for "lego"', async () => {
      await bolPage.expectSearchInputVisible();
      await bolPage.searchProduct("lego");
      await bolPage.clickSearchButton();
      await expect(page).toHaveURL(/searchtext=lego/i);
      await page.screenshot({ path: "resultpage.png" });
    });

    test('Click on the "Speelgoed" filter', async () => {
      await filterSortPage.clickFilter();
    });

    test("Navigate, check for titles on page 1 & 2 and verify they're not equal", async () => {
      const titlesPage1 = await productlistPage.getAllTitles();
      const firstFiveTitlesPage1 = titlesPage1.slice(0, 5);

      await page.screenshot({ path: "resultpage1.png" });
      await productlistPage.navigateToPage2();

      await waitForResponsePage.waitForBatchResponse();
      
      await page.screenshot({ path: "resultpage2.png" });

      const titlesPage2 = await productlistPage.getAllTitles();
      const firstFiveTitlesPage2 = titlesPage2.slice(0, 5);

      expect(firstFiveTitlesPage1).not.toEqual(firstFiveTitlesPage2);
    });
  });
});
