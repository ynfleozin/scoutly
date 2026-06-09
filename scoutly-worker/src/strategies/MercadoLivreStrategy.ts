import { CheerioAPI } from "cheerio";
import { IScraperStrategy } from "../domain/IScraperStrategy";

export class MercadoLivreStrategy implements IScraperStrategy {
  extractPrice($: CheerioAPI): number | null {
    const priceText = $(".andes-money-amount__fraction").first().text();

    return this.parsePrice(priceText);
  }

  private parsePrice(priceText: string): number | null {
    if (!priceText) return null;

    const cleanText = priceText.replace(/\./g, "").replace(",", ".");
    const parsed = parseFloat(cleanText);

    return isNaN(parsed) ? null : parsed;
  }
}
