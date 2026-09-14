import { describe, expect, it } from "vitest";
import { gerarSorteioAleatorio } from "./sorteioAleatorio";

describe("gerarSorteioAleatorio", () => {
  it("gera a quantidade pedida de cartelas únicas, do tamanho pedido, dentro do pool", () => {
    const pool = Array.from({ length: 18 }, (_, i) => i + 1);
    const resultado = gerarSorteioAleatorio(pool, 16, 12);

    expect(resultado.solicitado).toBe(12);
    expect(resultado.cartelas).toHaveLength(12);
    const chaves = new Set(resultado.cartelas.map(c => c.join(',')));
    expect(chaves.size).toBe(12);
    resultado.cartelas.forEach(cartela => {
      expect(cartela).toHaveLength(16);
      expect(new Set(cartela).size).toBe(16);
      cartela.forEach(n => expect(pool).toContain(n));
    });
  });

  it("retorna menos cartelas que o solicitado quando o pool não comporta tantas combinações distintas", () => {
    const pool = Array.from({ length: 16 }, (_, i) => i + 1);
    const resultado = gerarSorteioAleatorio(pool, 15, 50);

    expect(resultado.solicitado).toBe(50);
    expect(resultado.cartelas.length).toBeLessThanOrEqual(16);
    const chaves = new Set(resultado.cartelas.map(c => c.join(',')));
    expect(chaves.size).toBe(resultado.cartelas.length);
  });

  it("lança erro se o tamanho da cartela estiver fora de 15-20", () => {
    const pool = Array.from({ length: 20 }, (_, i) => i + 1);
    expect(() => gerarSorteioAleatorio(pool, 14, 5)).toThrow();
    expect(() => gerarSorteioAleatorio(pool, 21, 5)).toThrow();
  });

  it("lança erro se o pool for menor que o tamanho da cartela", () => {
    expect(() => gerarSorteioAleatorio([1, 2, 3], 15, 5)).toThrow();
  });

  it("lança erro se a quantidade solicitada for menor que 1", () => {
    const pool = Array.from({ length: 18 }, (_, i) => i + 1);
    expect(() => gerarSorteioAleatorio(pool, 15, 0)).toThrow();
  });
});
