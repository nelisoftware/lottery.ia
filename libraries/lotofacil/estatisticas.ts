import { Lotofacil } from "@prisma/client";
import { contarMaxConsecutivos, contarPares, contarRepetidos, extrairBolas, soma } from "./numeros";

export interface EstatisticasHistoricas {
  somaMin: number;
  somaMax: number;
  somaMedia: number;
  paresMin: number;
  paresMax: number;
  paresMedia: number;
  maxConsecutivosMedia: number;
  maxConsecutivosMax: number;
  repetidosAnteriorMin: number;
  repetidosAnteriorMax: number;
  repetidosAnteriorMedia: number;
}

const VAZIO: EstatisticasHistoricas = {
  somaMin: 0,
  somaMax: 0,
  somaMedia: 0,
  paresMin: 0,
  paresMax: 0,
  paresMedia: 0,
  maxConsecutivosMedia: 0,
  maxConsecutivosMax: 0,
  repetidosAnteriorMin: 0,
  repetidosAnteriorMax: 0,
  repetidosAnteriorMedia: 0,
};

function media(numeros: number[]): number {
  return numeros.length === 0 ? 0 : numeros.reduce((total, n) => total + n, 0) / numeros.length;
}

/**
 * Distribuição empírica dos concursos já sorteados (soma, paridade, maior
 * sequência de consecutivos, repetição em relação ao concurso anterior).
 * Calculada sempre a partir do histórico real recebido, nunca de valores fixos.
 */
export function calcularEstatisticas(historico: Lotofacil[]): EstatisticasHistoricas {
  if (historico.length === 0) return VAZIO;

  const somas: number[] = [];
  const pares: number[] = [];
  const maxConsecutivos: number[] = [];
  const repetidos: number[] = [];

  let anterior: number[] | null = null;
  historico.forEach(row => {
    const bolas = extrairBolas(row);
    somas.push(soma(bolas));
    pares.push(contarPares(bolas));
    maxConsecutivos.push(contarMaxConsecutivos(bolas));
    if (anterior !== null) {
      repetidos.push(contarRepetidos(bolas, anterior));
    }
    anterior = bolas;
  });

  return {
    somaMin: Math.min(...somas),
    somaMax: Math.max(...somas),
    somaMedia: media(somas),
    paresMin: Math.min(...pares),
    paresMax: Math.max(...pares),
    paresMedia: media(pares),
    maxConsecutivosMedia: media(maxConsecutivos),
    maxConsecutivosMax: Math.max(...maxConsecutivos),
    repetidosAnteriorMin: repetidos.length ? Math.min(...repetidos) : 0,
    repetidosAnteriorMax: repetidos.length ? Math.max(...repetidos) : 0,
    repetidosAnteriorMedia: media(repetidos),
  };
}
