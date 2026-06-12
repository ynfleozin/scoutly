import { IScraperStrategy } from "../domain/IScraperStrategy.js";
import { BooksToScrapeStrategy } from "./BooksToScrapeStrategy.js";

const strategies: Map<string, IScraperStrategy> = new Map([
  ["books.toscrape.com", new BooksToScrapeStrategy()],
]);

export function getStrategyForDomain(domain: string): IScraperStrategy | null {
  return strategies.get(domain) ?? null;
}
