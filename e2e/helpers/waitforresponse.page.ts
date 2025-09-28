import { Page, Response } from "@playwright/test";

export class WaitForResponsePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForBatchResponse(status: number = 200): Promise<Response> {
    return await this.page.waitForResponse(
      (response) =>
        response.url().includes("https://www.bol.com/rs/v1/batch") &&
        response.status() === status
    );
  }
}