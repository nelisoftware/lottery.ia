import { describe, expect, it } from "vitest";
import { gerarCartao, gerarCartoes } from "./gerador";

describe("gerarCartao", () => {
  it("gera um cartão respeitando filtros amplos", () => {
    const cartao = gerarCartao({
      quantidadeNumeros: 15,
      somaMin: 0,
      somaMax: 400,
      paresMin: 0,
      paresMax: 15,
      maxConsecutivos: 25,
    });

    expect(cartao).not.toBeNull();
    expect(cartao!.numeros).toHaveLength(15);
    expect(new Set(cartao!.numeros).size).toBe(15);
    cartao!.numeros.forEach(n => expect(n).toBeGreaterThanOrEqual(1));
    cartao!.numeros.forEach(n => expect(n).toBeLessThanOrEqual(25));
  });

  it("respeita filtros estreitos de soma e paridade", () => {
    const cartao = gerarCartao({
      quantidadeNumeros: 15,
      somaMin: 190,
      somaMax: 200,
      paresMin: 6,
      paresMax: 8,
      maxConsecutivos: 25,
    });

    expect(cartao).not.toBeNull();
    expect(cartao!.soma).toBeGreaterThanOrEqual(190);
    expect(cartao!.soma).toBeLessThanOrEqual(200);
    expect(cartao!.pares).toBeGreaterThanOrEqual(6);
    expect(cartao!.pares).toBeLessThanOrEqual(8);
  });

  it("retorna null quando o pool é menor que a quantidade pedida", () => {
    const cartao = gerarCartao({
      quantidadeNumeros: 15,
      somaMin: 0,
      somaMax: 400,
      paresMin: 0,
      paresMax: 15,
      maxConsecutivos: 25,
      poolPermitido: [1, 2, 3],
    });
    expect(cartao).toBeNull();
  });

  it("retorna null quando os filtros são impossíveis de satisfazer", () => {
    const cartao = gerarCartao(
      {
        quantidadeNumeros: 15,
        somaMin: 1,
        somaMax: 1,
        paresMin: 0,
        paresMax: 15,
        maxConsecutivos: 25,
      },
      50
    );
    expect(cartao).toBeNull();
  });

  it("repetidosAnterior é null quando nenhum concurso anterior é informado", () => {
    const cartao = gerarCartao({
      quantidadeNumeros: 15,
      somaMin: 0,
      somaMax: 400,
      paresMin: 0,
      paresMax: 15,
      maxConsecutivos: 25,
    });
    expect(cartao!.repetidosAnterior).toBeNull();
  });

  it("respeita a faixa de repetidos em relação ao concurso anterior", () => {
    const ultimoConcurso = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const cartao = gerarCartao({
      quantidadeNumeros: 15,
      somaMin: 0,
      somaMax: 400,
      paresMin: 0,
      paresMax: 15,
      maxConsecutivos: 25,
      ultimoConcurso,
      repetidosAnteriorMin: 6,
      repetidosAnteriorMax: 9,
    });

    expect(cartao).not.toBeNull();
    expect(cartao!.repetidosAnterior).toBeGreaterThanOrEqual(6);
    expect(cartao!.repetidosAnterior).toBeLessThanOrEqual(9);
  });

  it("retorna null quando a faixa de repetidos é impossível de satisfazer", () => {
    const ultimoConcurso = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const cartao = gerarCartao(
      {
        quantidadeNumeros: 15,
        somaMin: 0,
        somaMax: 400,
        paresMin: 0,
        paresMax: 15,
        maxConsecutivos: 25,
        ultimoConcurso,
        repetidosAnteriorMin: 0,
        repetidosAnteriorMax: 0,
      },
      100
    );
    expect(cartao).toBeNull();
  });
});

describe("gerarCartoes", () => {
  it("gera a quantidade solicitada quando os filtros são satisfazíveis", () => {
    const cartoes = gerarCartoes(
      {
        quantidadeNumeros: 15,
        somaMin: 0,
        somaMax: 400,
        paresMin: 0,
        paresMax: 15,
        maxConsecutivos: 25,
      },
      5
    );
    expect(cartoes).toHaveLength(5);
  });
});
