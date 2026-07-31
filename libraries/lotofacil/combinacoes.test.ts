import { describe, expect, it } from "vitest";
import { calcularFrequenciaCombinacoes } from "./combinacoes";
import { Lotofacil } from "@prisma/client";

function criarSorteio(numero: number, bolas: number[]): Lotofacil {
  const row: Partial<Lotofacil> = { numero, dataApuracao: new Date(), ganhadores: 0 };
  bolas.forEach((bola, i) => {
    (row as Record<string, number>)[`bola${String(i + 1).padStart(2, "0")}`] = bola;
  });
  return row as Lotofacil;
}

describe("calcularFrequenciaCombinacoes", () => {
  it("retorna as 300 duplas e 2300 ternos possíveis, zerados, para histórico vazio", () => {
    const duplas = calcularFrequenciaCombinacoes([], 2);
    expect(duplas).toHaveLength(300);
    duplas.forEach((d) => {
      expect(d.frequencia).toBe(0);
      expect(d.atrasoAtual).toBe(0);
      expect(d.atrasoRecorde).toBe(0);
    });

    const ternos = calcularFrequenciaCombinacoes([], 3);
    expect(ternos).toHaveLength(2300);
  });

  it("incrementa a frequência de uma dupla que se repete em concursos consecutivos e zera o atraso atual", () => {
    const bolas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const historico = [criarSorteio(1, bolas), criarSorteio(2, bolas), criarSorteio(3, bolas)];
    const resultado = calcularFrequenciaCombinacoes(historico, 2);

    const dupla3_17 = resultado.find((c) => c.chave === "3-17")!;
    expect(dupla3_17.frequencia).toBe(0); // 17 nunca saiu nesse histórico
    expect(dupla3_17.atrasoAtual).toBe(3);

    const dupla1_2 = resultado.find((c) => c.chave === "1-2")!;
    expect(dupla1_2.frequencia).toBe(3);
    expect(dupla1_2.atrasoAtual).toBe(0);

    const dupla20_21 = resultado.find((c) => c.chave === "20-21")!;
    expect(dupla20_21.frequencia).toBe(0);
    expect(dupla20_21.atrasoAtual).toBe(3);
    expect(dupla20_21.atrasoRecorde).toBe(3);
  });

  it("mantém o atrasoRecorde ao pico anterior quando a combinação volta a sair", () => {
    const comDupla = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const semDupla1e2 = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    const historico = [
      criarSorteio(1, semDupla1e2),
      criarSorteio(2, semDupla1e2),
      criarSorteio(3, comDupla),
    ];
    const resultado = calcularFrequenciaCombinacoes(historico, 2);

    const dupla1_2 = resultado.find((c) => c.chave === "1-2")!;
    expect(dupla1_2.frequencia).toBe(1);
    expect(dupla1_2.atrasoAtual).toBe(0); // saiu no último concurso
    expect(dupla1_2.atrasoRecorde).toBe(2); // recorde dos 2 primeiros concursos permanece
  });

  it("calcula corretamente para ternos", () => {
    const bolas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const historico = [criarSorteio(1, bolas)];
    const resultado = calcularFrequenciaCombinacoes(historico, 3);

    const terno1_2_3 = resultado.find((c) => c.chave === "1-2-3")!;
    expect(terno1_2_3.frequencia).toBe(1);

    const terno1_2_20 = resultado.find((c) => c.chave === "1-2-20")!;
    expect(terno1_2_20.frequencia).toBe(0);
    expect(terno1_2_20.atrasoAtual).toBe(1);
  });
});
