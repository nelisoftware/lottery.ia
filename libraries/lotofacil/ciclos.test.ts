import { describe, expect, it } from "vitest";
import {
  calcularCicloConjunto,
  calcularCicloDuplo,
  calcularCicloTriplo,
  calcularCicloDuploNaoSaindo,
  calcularCicloTriploNaoSaindo,
  SIMPLES,
  LINHA1,
  LINHA2,
  LINHA3,
  LINHA4,
  LINHA5,
  COLUNA1,
  COLUNA2,
  COLUNA3,
  COLUNA4,
  COLUNA5,
  PARES,
  IMPARES,
  DUPLAS_ADJACENTES,
  TRIPLAS_ADJACENTES,
} from "./ciclos";

describe("conjuntos fixos", () => {
  it("linhas e colunas particionam 1-25 sem sobreposição", () => {
    const linhas = [...LINHA1, ...LINHA2, ...LINHA3, ...LINHA4, ...LINHA5].sort((a, b) => a - b);
    const colunas = [...COLUNA1, ...COLUNA2, ...COLUNA3, ...COLUNA4, ...COLUNA5].sort((a, b) => a - b);
    expect(linhas).toEqual(SIMPLES);
    expect(colunas).toEqual(SIMPLES);
  });

  it("pares e ímpares particionam 1-25", () => {
    expect(PARES.length).toBe(12);
    expect(IMPARES.length).toBe(13);
    expect([...PARES, ...IMPARES].sort((a, b) => a - b)).toEqual(SIMPLES);
  });

  it("duplas e triplas adjacentes têm o tamanho esperado", () => {
    expect(DUPLAS_ADJACENTES).toHaveLength(24);
    expect(DUPLAS_ADJACENTES[0]).toBe("1-2");
    expect(DUPLAS_ADJACENTES[23]).toBe("24-25");
    expect(TRIPLAS_ADJACENTES).toHaveLength(23);
    expect(TRIPLAS_ADJACENTES[0]).toBe("1-2-3");
    expect(TRIPLAS_ADJACENTES[22]).toBe("23-24-25");
  });
});

describe("calcularCicloConjunto", () => {
  const universo = [1, 2, 3];

  it("remove os números sorteados do restante do ciclo", () => {
    const resultado = calcularCicloConjunto(universo, "", [1, 4, 5]);
    expect(resultado).toEqual({ numeros: "2;3;", completo: false });
  });

  it("continua reduzindo a partir do estado anterior", () => {
    const resultado = calcularCicloConjunto(universo, "2;3;", [2]);
    expect(resultado).toEqual({ numeros: "3;", completo: false });
  });

  it("fecha o ciclo quando o último número do conjunto sai", () => {
    const resultado = calcularCicloConjunto(universo, "3;", [3]);
    expect(resultado).toEqual({ numeros: "", completo: true });
  });

  it("reinicia com o conjunto completo após o fechamento (estado vazio)", () => {
    const resultado = calcularCicloConjunto(universo, "", [9]);
    expect(resultado).toEqual({ numeros: "1;2;3;", completo: false });
  });
});

describe("calcularCicloDuplo", () => {
  it("remove duplas adjacentes presentes no mesmo sorteio", () => {
    const resultado = calcularCicloDuplo("", [1, 2, 3, 5, 7]);
    expect(resultado.numeros).not.toContain("1-2;");
    expect(resultado.numeros).not.toContain("2-3;");
    expect(resultado.completo).toBe(false);
  });

  it("fecha o ciclo quando a última dupla restante sai", () => {
    const resultado = calcularCicloDuplo("24-25;", [24, 25]);
    expect(resultado).toEqual({ numeros: "", completo: true });
  });
});

describe("calcularCicloTriplo", () => {
  it("remove a tripla adjacente presente no mesmo sorteio", () => {
    const resultado = calcularCicloTriplo("1-2-3;", [1, 2, 3, 10]);
    expect(resultado).toEqual({ numeros: "", completo: true });
  });

  it("mantém a tripla quando os números não saem em sequência no sorteio", () => {
    const resultado = calcularCicloTriplo("1-2-3;", [1, 2, 10]);
    expect(resultado).toEqual({ numeros: "1-2-3;", completo: false });
  });
});

describe("calcularCicloDuploNaoSaindo", () => {
  it("remove a dupla quando dois números consecutivos ficam ausentes", () => {
    const dezenas = SIMPLES.filter(n => n !== 5 && n !== 6);
    const resultado = calcularCicloDuploNaoSaindo("", dezenas);
    expect(resultado.numeros).not.toContain("5-6;");
    expect(resultado.completo).toBe(false);
  });

  it("usa o valor anterior a i quando as ausências não são consecutivas (comportamento herdado)", () => {
    const dezenas = SIMPLES.filter(n => n !== 5 && n !== 9);
    const resultado = calcularCicloDuploNaoSaindo("", dezenas);
    expect(resultado.numeros).not.toContain("8-9;");
  });
});

describe("calcularCicloTriploNaoSaindo", () => {
  it("remove a tripla quando três números consecutivos ficam ausentes", () => {
    const dezenas = SIMPLES.filter(n => ![5, 6, 7].includes(n));
    const resultado = calcularCicloTriploNaoSaindo("", dezenas);
    expect(resultado.numeros).not.toContain("5-6-7;");
    expect(resultado.completo).toBe(false);
  });
});
