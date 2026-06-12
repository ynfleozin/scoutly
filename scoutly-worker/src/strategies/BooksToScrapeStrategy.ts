import { CheerioAPI } from "cheerio";
import { IScraperStrategy } from "../domain/IScraperStrategy.js";

export class BooksToScrapeStrategy implements IScraperStrategy {
  executionType: "AXIOS" = "AXIOS";

  extractPrice($: CheerioAPI): number | null {
    const priceText = $(".price_color").first().text();

    if (!priceText) {
      return null;
    }

    const normalizedPrice = priceText.replace(/[^\d.,]/g, "").replace(",", ".");

    const price = Number(normalizedPrice);

    return isNaN(price) ? null : price;
  }
}
