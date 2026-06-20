import * as cheerio from "cheerio";
import axios from "axios";
import vanillaPuppeteer from "puppeteer";
import { addExtra } from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { getStrategyForDomain } from "../strategies/StrategyRegistry.js";
import { IScraperStrategy } from "../domain/IScraperStrategy.js";

const puppeteer = addExtra(vanillaPuppeteer);
puppeteer.use(StealthPlugin());

export class ScraperEngine {
  async processUrl(url: string): Promise<number | null> {
    const domain = this.extractDomain(url);
    const strategy = getStrategyForDomain(domain);

    if (!strategy) {
      throw new Error("Loja não suportada");
    }

    if (strategy.executionType === "AXIOS") {
      return this.executeAxios(url, strategy);
    }

    if (strategy.executionType === "PUPPETEER") {
      return this.executePuppeteer(url, strategy);
    }

    throw new Error("Tipo de execução não suportado");
  }

  private async executeAxios(
    url: string,
    strategy: IScraperStrategy,
  ): Promise<number | null> {
    try {
      console.log(`[Engine] Extraindo via AXIOS: ${url}`);
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      const $ = cheerio.load(response.data);

      return strategy.extractPrice($);
    } catch (error) {
      console.error("Erro na extração via Axios: ", error);
      return null;
    }
  }

  private async executePuppeteer(
    url: string,
    strategy: IScraperStrategy,
  ): Promise<number | null> {
    console.log(`[Engine] Extraindo via PUPPETEER: ${url}`);
    let browser = null;

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();

      await page.setRequestInterception(true);
      page.on("request", (req) => {
        if (["image", "stylesheet", "font"].includes(req.resourceType())) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

      const html = await page.content();

      const $ = cheerio.load(html);
      return strategy.extractPrice($);
    } catch (error) {
      console.error("Erro na extração via Puppeteer: ", error);
      return null;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private extractDomain(url: string): string {
    const parsedUrl = new URL(url);

    return parsedUrl.hostname.replace("www.", "");
  }
}
