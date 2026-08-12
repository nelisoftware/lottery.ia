import { describe, expect, it } from "vitest";
import { avaliarParametrosConcurso } from "./parametros";
import { EstatisticasHistoricas } from "./estatisticas";

const estatisticasBase: EstatisticasHistoricas = {
  somaMin: 150, somaMax: 220, somaMedia: 185, somaP10: 175, somaP90: 195,
  paresMin: 4, paresMax: 11, paresMedia: 7, paresP10: 6, paresP90: 9,
  imparesP10: 6, imparesP90: 9,
  maxConsecutivosMedia: 3, maxConsecutivosMax: 8,
  repetidosAnteriorMin: 5, repetidosAnteriorMax: 11, repetidosAnteriorMedia: 8,
  repetidosAnteriorP10: 6, repetidosAnteriorP90: 10,
  molduraMedia: 9.6, molduraP10: 9, molduraP90: 11,
  primosMedia: 5.4, primosP10: 4, primosP90: 7,
  multiplosMedia: 4.8, multiplosP10: 4, multiplosP90: 6,
  fibonacciMedia: 4.2, fibonacciP10: 3, fibonacciP90: 6,
};

describe("avaliarParametrosConcurso", () => {
  it("marca 'fora_padrao' quando o valor cai fora da faixa p10-p90, como no concurso 3758", () => {
    const bolas = [1, 3, 4, 5, 8, 9, 11, 12, 13, 14, 17, 18, 20, 24, 25];
    const anterior = [2, 3, 6, 7, 8, 9, 10, 12, 13, 15, 16, 19, 21, 22, 23];

    const parametros = avaliarParametrosConcurso(bolas, anterior, estatisticasBase);
    const moldura = parametros.find(p => p.nome === 'Moldura');

    expect(moldura?.valor).toBe(8);
    expect(moldura?.status).toBe('fora_padrao');

    const impares = parametros.find(p => p.nome === 'Ímpares');
    expect(impares?.valor).toBe(8);
    expect(impares?.status).toBe('padrao');
  });

  it("classifica 'Repetidas' como 'padrao' quando não há concurso anterior", () => {
    const bolas = [1, 3, 4, 5, 8, 9, 11, 12, 13, 14, 17, 18, 20, 24, 25];
    const parametros = avaliarParametrosConcurso(bolas, null, estatisticasBase);
    const repetidas = parametros.find(p => p.nome === 'Repetidas');

    expect(repetidas?.valor).toBe(0);
    expect(repetidas?.status).toBe('padrao');
  });
});
