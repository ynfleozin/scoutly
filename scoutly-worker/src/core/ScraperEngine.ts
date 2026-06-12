import * as cheerio from "cheerio";
import axios from "axios";

import { getStrategyForDomain } from "../strategies/StrategyRegistry.js";
import { IScraperStrategy } from "../domain/IScraperStrategy.js";

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
      const response = await axios.get(url);
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
    console.log("Fluxo Puppeteer ainda não implementado para: ", url);
    return null;
  }

  private extractDomain(url: string): string {
    const parsedUrl = new URL(url);

    return parsedUrl.hostname.replace("www.", "");
  }
}
