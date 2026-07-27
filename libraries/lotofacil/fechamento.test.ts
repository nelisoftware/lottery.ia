import { describe, expect, it } from "vitest";
import { gerarFechamento } from "./fechamento";

function combinacoesEsperadas(n: number, k: number): number {
  let resultado = 1;
  for (let i = 0; i < k; i++) {
    resultado = (resultado * (n - i)) / (i + 1);
  }
  return Math.round(resultado);
}

describe("gerarFechamento", () => {
  it("retorna vazio quando o pool é menor que o tamanho da cartela", () => {
    const resultado = gerarFechamento([1, 2, 3], 15);
    expect(resultado).toEqual({ cartelas: [], garantiaFormal: false });
  });

  it("gera cobertura exaustiva com garantia formal para pools de até 20 números", () => {
    const pool = Array.from({ length: 16 }, (_, i) => i + 1);
    const resultado = gerarFechamento(pool, 15);

    expect(resultado.garantiaFormal).toBe(true);
    expect(resultado.cartelas).toHaveLength(combinacoesEsperadas(16, 15));
    resultado.cartelas.forEach(cartela => {
      expect(cartela).toHaveLength(15);
      expect(new Set(cartela).size).toBe(15);
      cartela.forEach(n => expect(pool).toContain(n));
    });
  });

  it("garante, na cobertura exaustiva, que a melhor cartela acerta min(j, 15) se j números do pool saírem", () => {
    const pool = Array.from({ length: 16 }, (_, i) => i + 1);
    const resultado = gerarFechamento(pool, 15);

    // sorteio fictício: 14 dos 16 números do pool + 1 fora do pool
    const sorteio = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 99];
    const melhorAcerto = Math.max(
      ...resultado.cartelas.map(cartela => cartela.filter(n => sorteio.includes(n)).length)
    );
    expect(melhorAcerto).toBe(14);
  });

  it("usa heurística de cobertura de pares (sem garantia formal) para pools acima de 20 números", () => {
    const pool = Array.from({ length: 21 }, (_, i) => i + 1);
    const resultado = gerarFechamento(pool, 15, 300);

    expect(resultado.garantiaFormal).toBe(false);
    expect(resultado.cartelas.length).toBeGreaterThan(0);
    resultado.cartelas.forEach(cartela => expect(cartela).toHaveLength(15));
  });

  it("a heurística de cobertura de pares cobre todo par do pool em pelo menos uma cartela", () => {
    const pool = [1, 2, 3, 4, 5, 6];
    const resultado = gerarFechamento(pool, 4, 50);

    const paresCobertos = new Set<string>();
    resultado.cartelas.forEach(cartela => {
      for (let i = 0; i < cartela.length; i++) {
        for (let j = i + 1; j < cartela.length; j++) {
          paresCobertos.add(`${cartela[i]}-${cartela[j]}`);
        }
      }
    });

    for (let i = 0; i < pool.length; i++) {
      for (let j = i + 1; j < pool.length; j++) {
        expect(paresCobertos.has(`${pool[i]}-${pool[j]}`)).toBe(true);
      }
    }
  });
});
