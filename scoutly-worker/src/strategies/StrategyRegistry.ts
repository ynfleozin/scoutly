import { IScraperStrategy } from "../domain/IScraperStrategy";
import { MercadoLivreStrategy } from "./MercadoLivreStrategy";

const strategies: Map<string, IScraperStrategy> = new Map([
  ["mercadolivre.com.br", new MercadoLivreStrategy()],
]);

export function getStrategyForDomain(domain: string): IScraperStrategy | null {
  return strategies.get(domain) ?? null;
}
