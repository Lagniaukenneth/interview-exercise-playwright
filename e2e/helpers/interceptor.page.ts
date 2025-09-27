import { Page, Locator, expect } from "@playwright/test";

export class InterceptorPage {
  readonly page: Page;
  readonly interceptor: Locator;

  constructor(page: Page) {
    this.page = page;
    this.interceptor = page.locator('a[data-bltgh$="ProductTitle"]');
  }

  async blockAddToCartRequests() {
    await this.page.route("**/order/basket/addItems.html**", (route) => {
      route.abort();
    });
  }
}
