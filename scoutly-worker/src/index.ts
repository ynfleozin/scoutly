import { ScraperEngine } from "./core/ScraperEngine.js";

async function main() {
  const scraperEngine = new ScraperEngine();

  const productUrl =
    "http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html";

  const price = await scraperEngine.processUrl(productUrl);

  console.log(price);
}

main().catch(console.error);
