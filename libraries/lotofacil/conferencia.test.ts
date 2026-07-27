import { describe, expect, it } from "vitest";
import { calcularAcertos, conferirHistorico } from "./conferencia";
import { Lotofacil } from "@prisma/client";

function criarSorteio(numero: number, bolas: number[], dataApuracao = new Date("2024-01-01")): Lotofacil {
  const row: Partial<Lotofacil> = { numero, dataApuracao, ganhadores: 0 };
  bolas.forEach((bola, i) => {
    (row as Record<string, number>)[`bola${String(i + 1).padStart(2, "0")}`] = bola;
  });
  return row as Lotofacil;
}

describe("calcularAcertos", () => {
  it("conta a interseção entre cartão e sorteio", () => {
    const cartao = [1, 2, 3, 4, 5];
    const sorteio = [1, 2, 6, 7, 8];
    expect(calcularAcertos(cartao, sorteio)).toBe(2);
  });

  it("retorna 0 quando não há interseção", () => {
    expect(calcularAcertos([1, 2, 3], [4, 5, 6])).toBe(0);
  });
});

describe("conferirHistorico", () => {
  const bolas1a15 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const bolas11a25 = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

  it("calcula acertos e faixa de prêmio por concurso", () => {
    const cartao = bolas1a15;
    const historico = [criarSorteio(100, bolas1a15), criarSorteio(101, bolas11a25)];

    const resultado = conferirHistorico(cartao, historico);

    expect(resultado[0]).toMatchObject({ concurso: 100, hits: 15, prizeLevel: 15 });
    expect(resultado[1]).toMatchObject({ concurso: 101, hits: 5, prizeLevel: null });
  });

  it("prizeLevel é null abaixo de 11 acertos e igual aos hits a partir de 11", () => {
    const cartao = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const historico = [criarSorteio(1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 17, 18, 19, 20])];
    const resultado = conferirHistorico(cartao, historico);
    expect(resultado[0].hits).toBe(10);
    expect(resultado[0].prizeLevel).toBeNull();
  });
});
