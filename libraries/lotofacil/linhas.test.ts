import { describe, expect, it } from "vitest";
import { Lotofacil } from "@prisma/client";
import { calcularEstatisticasLinhas, LINHAS } from "./linhas";

function criarSorteio(numero: number, bolas: number[]): Lotofacil {
  const row: Partial<Lotofacil> = { numero, dataApuracao: new Date(), ganhadores: 0 };
  bolas.forEach((bola, i) => {
    (row as Record<string, number>)[`bola${String(i + 1).padStart(2, "0")}`] = bola;
  });
  return row as Lotofacil;
}

describe("LINHAS", () => {
  it("divide os 25 números em 5 linhas de 5", () => {
    expect(LINHAS).toHaveLength(5);
    expect(LINHAS.flat()).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
  });
});

describe("calcularEstatisticasLinhas", () => {
  it("calcula frequência, atraso e sequência para um único concurso", () => {
    const bolas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const resultado = calcularEstatisticasLinhas([criarSorteio(1, bolas)]);

    const numero1 = resultado.find((r) => r.numero === 1);
    expect(numero1?.frequenciaAtual).toBe(1);
    expect(numero1?.sequenciaAtual).toBe(1);
    expect(numero1?.atrasoAtual).toBe(0);
    expect(numero1?.percentual).toBe(100);

    const numero20 = resultado.find((r) => r.numero === 20);
    expect(numero20?.frequenciaAtual).toBe(0);
    expect(numero20?.sequenciaAtual).toBe(0);
    expect(numero20?.atrasoAtual).toBe(1);
    expect(numero20?.percentual).toBe(0);
  });

  it("zera a sequência e acumula o atraso quando o número para de sair", () => {
    const sorteios = [
      criarSorteio(1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
      criarSorteio(2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16]),
      criarSorteio(3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17]),
    ];
    const resultado = calcularEstatisticasLinhas(sorteios);

    const numero1 = resultado.find((r) => r.numero === 1);
    expect(numero1?.frequenciaAtual).toBe(2);
    expect(numero1?.sequenciaAtual).toBe(0);
    expect(numero1?.atrasoAtual).toBe(1);
  });

  it("retorna o histórico recente na ordem do mais antigo para o mais novo, limitado à janela configurada", () => {
    const sorteios = Array.from({ length: 11 }, (_, i) =>
      criarSorteio(i + 1, i % 2 === 0
        ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        : [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 11, 12, 13, 14, 15]
      )
    );
    const resultado = calcularEstatisticasLinhas(sorteios);

    const numero1 = resultado.find((r) => r.numero === 1);
    expect(numero1?.historicoRecente).toHaveLength(10);
    expect(numero1?.historicoRecente).toEqual([false, true, false, true, false, true, false, true, false, true]);
  });

  it("considera apenas os últimos 10 concursos para a frequência e o percentual", () => {
    const sorteios = Array.from({ length: 12 }, (_, i) => {
      const numero = i + 1;
      const bolas = i === 0
        ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        : [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      return criarSorteio(numero, bolas);
    });
    const resultado = calcularEstatisticasLinhas(sorteios);

    const numero1 = resultado.find((r) => r.numero === 1);
    expect(numero1?.frequenciaAtual).toBe(0);
    expect(numero1?.percentual).toBe(0);

    const numero16 = resultado.find((r) => r.numero === 16);
    expect(numero16?.frequenciaAtual).toBe(10);
    expect(numero16?.percentual).toBe(100);
  });

  it("retorna tudo zerado para histórico vazio", () => {
    const resultado = calcularEstatisticasLinhas([]);
    expect(resultado).toHaveLength(25);
    expect(resultado.every((r) => r.frequenciaAtual === 0 && r.percentual === 0)).toBe(true);
    expect(resultado.every((r) => r.historicoRecente.length === 0)).toBe(true);
  });
});
