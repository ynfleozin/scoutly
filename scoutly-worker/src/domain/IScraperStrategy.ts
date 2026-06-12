import { CheerioAPI } from "cheerio";

export interface IScraperStrategy {
  executionType: "AXIOS" | "PUPPETEER" | "API";

  extractPrice($: CheerioAPI): number | null;
}
