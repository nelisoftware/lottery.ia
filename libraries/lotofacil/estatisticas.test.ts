import { describe, expect, it } from "vitest";
import { calcularEstatisticas } from "./estatisticas";
import { Lotofacil } from "@prisma/client";

function criarSorteio(numero: number, bolas: number[]): Lotofacil {
  const row: Partial<Lotofacil> = { numero, dataApuracao: new Date(), ganhadores: 0 };
  bolas.forEach((bola, i) => {
    (row as Record<string, number>)[`bola${String(i + 1).padStart(2, "0")}`] = bola;
  });
  return row as Lotofacil;
}

describe("calcularEstatisticas", () => {
  it("retorna tudo zerado para histórico vazio", () => {
    const resultado = calcularEstatisticas([]);
    expect(resultado.somaMin).toBe(0);
    expect(resultado.paresMedia).toBe(0);
  });

  it("calcula soma, pares e consecutivos de um único concurso", () => {
    const bolas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const resultado = calcularEstatisticas([criarSorteio(1, bolas)]);

    expect(resultado.somaMin).toBe(120);
    expect(resultado.somaMax).toBe(120);
    expect(resultado.somaMedia).toBe(120);
    expect(resultado.paresMin).toBe(7);
    expect(resultado.maxConsecutivosMax).toBe(15);
    expect(resultado.repetidosAnteriorMedia).toBe(0);
  });

  it("calcula a repetição em relação ao concurso anterior", () => {
    const bolas1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const bolas2 = [1, 2, 3, 4, 5, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    const resultado = calcularEstatisticas([criarSorteio(1, bolas1), criarSorteio(2, bolas2)]);

    expect(resultado.repetidosAnteriorMedia).toBe(5);
  });

  it("calcula min/max de repetidos ao longo de vários concursos", () => {
    const bolas1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const bolas2 = [1, 2, 3, 4, 5, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]; // 5 repetidos de bolas1
    const bolas3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 17, 18, 19, 20]; // 10 repetidos de bolas2
    const resultado = calcularEstatisticas([criarSorteio(1, bolas1), criarSorteio(2, bolas2), criarSorteio(3, bolas3)]);

    expect(resultado.repetidosAnteriorMin).toBe(5);
    expect(resultado.repetidosAnteriorMax).toBe(10);
    expect(resultado.repetidosAnteriorMedia).toBe(7.5);
  });
});
