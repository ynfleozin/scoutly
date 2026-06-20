import { CheerioAPI } from "cheerio";
import { IScraperStrategy } from "../domain/IScraperStrategy.js";

export class AmazonStrategy implements IScraperStrategy {
  executionType: "PUPPETEER" = "PUPPETEER";

  extractPrice($: CheerioAPI): number | null {
    const wholeText = $(".a-price-whole").first().text();
    const fractionText = $(".a-price-fraction").first().text();

    if (!wholeText) {
      return null;
    }

    const normalizedWhole = wholeText.replace(/[^\d]/g, "");
    const normalizedFraction = fractionText.replace(/[^\d]/g, "");

    const priceString = `${normalizedWhole}.${normalizedFraction || "00"}`;
    const price = Number(priceString);

    return isNaN(price) ? null : price;
  }
}
