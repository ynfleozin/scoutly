import { IScraperStrategy } from "../domain/IScraperStrategy.js";
import { AmazonStrategy } from "./AmazonStrategy.js";
import { BooksToScrapeStrategy } from "./BooksToScrapeStrategy.js";

const strategies = new Map<string, IScraperStrategy>([
  ["books.toscrape.com", new BooksToScrapeStrategy()],
  ["amazon.com.br", new AmazonStrategy()],
  ["amazon.com", new AmazonStrategy()],
]);

export function getStrategyForDomain(domain: string): IScraperStrategy | null {
  return strategies.get(domain) ?? null;
}
