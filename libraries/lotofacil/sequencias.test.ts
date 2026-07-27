import { describe, expect, it } from "vitest";
import { calcularSequenciasPorNumero } from "./sequencias";
import { Lotofacil } from "@prisma/client";

function criarSorteio(numero: number, bolas: number[]): Lotofacil {
  const row: Partial<Lotofacil> = { numero, dataApuracao: new Date(), ganhadores: 0 };
  bolas.forEach((bola, i) => {
    (row as Record<string, number>)[`bola${String(i + 1).padStart(2, "0")}`] = bola;
  });
  return row as Lotofacil;
}

describe("calcularSequenciasPorNumero", () => {
  it("retorna 25 números zerados para histórico vazio", () => {
    const resultado = calcularSequenciasPorNumero([]);
    expect(resultado).toHaveLength(25);
    resultado.forEach((r) => {
      expect(r.maxSequencia).toBe(0);
      expect(r.maxAusencia).toBe(0);
      expect(r.atual).toBe(0);
      expect(r.status).toBe("ausente");
    });
  });

  it("acompanha a sequência em andamento de um número que está saindo", () => {
    const bolas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const historico = [criarSorteio(1, bolas), criarSorteio(2, bolas), criarSorteio(3, bolas)];
    const resultado = calcularSequenciasPorNumero(historico);

    const numero1 = resultado.find((r) => r.numero === 1)!;
    expect(numero1.status).toBe("saindo");
    expect(numero1.atual).toBe(3);
    expect(numero1.maxSequencia).toBe(3);
    expect(numero1.maxAusencia).toBe(0);

    const numero20 = resultado.find((r) => r.numero === 20)!;
    expect(numero20.status).toBe("ausente");
    expect(numero20.atual).toBe(3);
    expect(numero20.maxAusencia).toBe(3);
    expect(numero20.maxSequencia).toBe(0);
  });

  it("reseta a sequência atual quando o status muda no último concurso", () => {
    const comNumero1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const semNumero1 = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    const historico = [
      criarSorteio(1, comNumero1),
      criarSorteio(2, comNumero1),
      criarSorteio(3, semNumero1),
    ];
    const resultado = calcularSequenciasPorNumero(historico);

    const numero1 = resultado.find((r) => r.numero === 1)!;
    expect(numero1.status).toBe("ausente");
    expect(numero1.atual).toBe(1);
    expect(numero1.maxSequencia).toBe(2); // recorde histórico permanece
    expect(numero1.maxAusencia).toBe(1);
  });
});
