import { describe, expect, it } from "vitest";
import { Lotofacil } from "@prisma/client";
import { calcularEstatisticasParesImpares } from "./paresImpares";

function criarSorteio(numero: number, bolas: number[]): Lotofacil {
  const row: Partial<Lotofacil> = { numero, dataApuracao: new Date(), ganhadores: 0 };
  bolas.forEach((bola, i) => {
    (row as Record<string, number>)[`bola${String(i + 1).padStart(2, "0")}`] = bola;
  });
  return row as Lotofacil;
}

describe("calcularEstatisticasParesImpares", () => {
  it("só existem os 11 splits matematicamente possíveis (2 a 12 pares)", () => {
    const resultado = calcularEstatisticasParesImpares([]);
    expect(resultado).toHaveLength(11);
    expect(resultado.map((r) => r.qtdPares).sort((a, b) => a - b)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(resultado.find((r) => [0, 1, 13, 14, 15].includes(r.qtdPares))).toBeUndefined();
    expect(resultado.every((r) => r.qtdPares + r.qtdImpares === 15)).toBe(true);
  });

  it("calcula um único concurso", () => {
    // 8 pares: 2,4,6,8,10,12,14,16 / 7 ímpares: 1,3,5,7,9,11,13
    const bolas = [2, 4, 6, 8, 10, 12, 14, 16, 1, 3, 5, 7, 9, 11, 13];
    const resultado = calcularEstatisticasParesImpares([criarSorteio(1, bolas)]);

    const oitoPares = resultado.find((r) => r.qtdPares === 8);
    expect(oitoPares?.ocorrencias).toBe(1);
    expect(oitoPares?.atrasoAtual).toBe(0);
    expect(oitoPares?.ultimaOcorrencia).toBe(1);
    expect(oitoPares?.percentual).toBe(100);
    expect(oitoPares?.mediaOcorrencia).toBe(1);

    const setePares = resultado.find((r) => r.qtdPares === 7);
    expect(setePares?.ocorrencias).toBe(0);
    expect(setePares?.atrasoAtual).toBe(1);
    expect(setePares?.ultimaOcorrencia).toBeNull();
    expect(setePares?.percentual).toBe(0);
    expect(setePares?.mediaOcorrencia).toBe(0);
  });

  it("zera o atraso e atualiza a última ocorrência quando o split se repete, mas mantém a última ocorrência quando ele falta", () => {
    const oitoParesBolas = [2, 4, 6, 8, 10, 12, 14, 16, 1, 3, 5, 7, 9, 11, 13];
    const novePares = [2, 4, 6, 8, 10, 12, 14, 16, 18, 1, 3, 5, 7, 9, 11];

    const sorteios = [
      criarSorteio(1, oitoParesBolas), // 8 pares
      criarSorteio(2, novePares), // 9 pares (não é 8)
      criarSorteio(3, oitoParesBolas), // 8 pares de novo
    ];
    const resultado = calcularEstatisticasParesImpares(sorteios);

    const oitoPares = resultado.find((r) => r.qtdPares === 8);
    expect(oitoPares?.ocorrencias).toBe(2);
    expect(oitoPares?.atrasoAtual).toBe(0);
    expect(oitoPares?.ultimaOcorrencia).toBe(3);

    const resultadoSemRepetir = calcularEstatisticasParesImpares([sorteios[0], sorteios[1]]);
    const oitoParesSemRepetir = resultadoSemRepetir.find((r) => r.qtdPares === 8);
    expect(oitoParesSemRepetir?.atrasoAtual).toBe(1);
    expect(oitoParesSemRepetir?.ultimaOcorrencia).toBe(1);
  });

  it("calcula percentual e média de ocorrência corretamente", () => {
    const oitoParesBolas = [2, 4, 6, 8, 10, 12, 14, 16, 1, 3, 5, 7, 9, 11, 13];
    const novePares = [2, 4, 6, 8, 10, 12, 14, 16, 18, 1, 3, 5, 7, 9, 11];

    const sorteios = [
      criarSorteio(1, oitoParesBolas),
      criarSorteio(2, novePares),
      criarSorteio(3, oitoParesBolas),
      criarSorteio(4, novePares),
    ];
    const resultado = calcularEstatisticasParesImpares(sorteios);

    const oitoPares = resultado.find((r) => r.qtdPares === 8);
    expect(oitoPares?.ocorrencias).toBe(2);
    expect(oitoPares?.percentual).toBe(50);
    expect(oitoPares?.mediaOcorrencia).toBe(2);
  });

  it("retorna tudo zerado/nulo para histórico vazio", () => {
    const resultado = calcularEstatisticasParesImpares([]);
    expect(resultado.every((r) =>
      r.ocorrencias === 0 &&
      r.atrasoAtual === 0 &&
      r.percentual === 0 &&
      r.mediaOcorrencia === 0 &&
      r.ultimaOcorrencia === null
    )).toBe(true);
  });
});
