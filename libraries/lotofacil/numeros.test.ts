import { describe, expect, it } from "vitest";
import { contarImpares, contarPares, extrairBolas, soma } from "./numeros";
import { Lotofacil } from "@prisma/client";

function criarSorteio(bolas: number[]): Lotofacil {
  const row: Partial<Lotofacil> = { numero: 1, dataApuracao: new Date(), ganhadores: 0 };
  bolas.forEach((bola, i) => {
    (row as Record<string, number>)[`bola${String(i + 1).padStart(2, "0")}`] = bola;
  });
  return row as Lotofacil;
}

describe("extrairBolas", () => {
  it("retorna as 15 bolas na ordem das colunas", () => {
    const bolas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    expect(extrairBolas(criarSorteio(bolas))).toEqual(bolas);
  });
});

describe("contarPares/contarImpares", () => {
  it("conta corretamente pares e ímpares", () => {
    const numeros = [1, 2, 3, 4, 5, 6];
    expect(contarPares(numeros)).toBe(3);
    expect(contarImpares(numeros)).toBe(3);
  });

  it("retorna 0 para lista vazia", () => {
    expect(contarPares([])).toBe(0);
    expect(contarImpares([])).toBe(0);
  });
});

describe("soma", () => {
  it("soma todos os números", () => {
    expect(soma([1, 2, 3, 4, 5])).toBe(15);
  });

  it("retorna 0 para lista vazia", () => {
    expect(soma([])).toBe(0);
  });
});
