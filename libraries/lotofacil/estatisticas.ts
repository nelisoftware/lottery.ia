import { Lotofacil } from "@prisma/client";
import {
  contarFibonacci,
  contarMaxConsecutivos,
  contarMoldura,
  contarMultiplos,
  contarPares,
  contarPrimos,
  contarRepetidos,
  extrairBolas,
  soma,
} from "./numeros";

export interface EstatisticasHistoricas {
  somaMin: number;
  somaMax: number;
  somaMedia: number;
  somaP10: number;
  somaP90: number;
  paresMin: number;
  paresMax: number;
  paresMedia: number;
  paresP10: number;
  paresP90: number;
  imparesP10: number;
  imparesP90: number;
  maxConsecutivosMedia: number;
  maxConsecutivosMax: number;
  repetidosAnteriorMin: number;
  repetidosAnteriorMax: number;
  repetidosAnteriorMedia: number;
  repetidosAnteriorP10: number;
  repetidosAnteriorP90: number;
  molduraMedia: number;
  molduraP10: number;
  molduraP90: number;
  primosMedia: number;
  primosP10: number;
  primosP90: number;
  multiplosMedia: number;
  multiplosP10: number;
  multiplosP90: number;
  fibonacciMedia: number;
  fibonacciP10: number;
  fibonacciP90: number;
}

const VAZIO: EstatisticasHistoricas = {
  somaMin: 0,
  somaMax: 0,
  somaMedia: 0,
  somaP10: 0,
  somaP90: 0,
  paresMin: 0,
  paresMax: 0,
  paresMedia: 0,
  paresP10: 0,
  paresP90: 0,
  imparesP10: 0,
  imparesP90: 0,
  maxConsecutivosMedia: 0,
  maxConsecutivosMax: 0,
  repetidosAnteriorMin: 0,
  repetidosAnteriorMax: 0,
  repetidosAnteriorMedia: 0,
  repetidosAnteriorP10: 0,
  repetidosAnteriorP90: 0,
  molduraMedia: 0,
  molduraP10: 0,
  molduraP90: 0,
  primosMedia: 0,
  primosP10: 0,
  primosP90: 0,
  multiplosMedia: 0,
  multiplosP10: 0,
  multiplosP90: 0,
  fibonacciMedia: 0,
  fibonacciP10: 0,
  fibonacciP90: 0,
};

function media(numeros: number[]): number {
  return numeros.length === 0 ? 0 : numeros.reduce((total, n) => total + n, 0) / numeros.length;
}

/** Percentil `p` (0-100) de uma lista, por interpolação linear sobre os valores ordenados. */
export function percentil(numeros: number[], p: number): number {
  if (numeros.length === 0) return 0;
  const ordenados = [...numeros].sort((a, b) => a - b);
  const indice = (p / 100) * (ordenados.length - 1);
  const indiceBaixo = Math.floor(indice);
  const indiceAlto = Math.ceil(indice);
  if (indiceBaixo === indiceAlto) return ordenados[indiceBaixo];
  const fracao = indice - indiceBaixo;
  return ordenados[indiceBaixo] + (ordenados[indiceAlto] - ordenados[indiceBaixo]) * fracao;
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
  const impares: number[] = [];
  const maxConsecutivos: number[] = [];
  const repetidos: number[] = [];
  const molduras: number[] = [];
  const primos: number[] = [];
  const multiplos: number[] = [];
  const fibonaccis: number[] = [];

  let anterior: number[] | null = null;
  historico.forEach(row => {
    const bolas = extrairBolas(row);
    somas.push(soma(bolas));
    pares.push(contarPares(bolas));
    impares.push(bolas.length - contarPares(bolas));
    maxConsecutivos.push(contarMaxConsecutivos(bolas));
    molduras.push(contarMoldura(bolas));
    primos.push(contarPrimos(bolas));
    multiplos.push(contarMultiplos(bolas));
    fibonaccis.push(contarFibonacci(bolas));
    if (anterior !== null) {
      repetidos.push(contarRepetidos(bolas, anterior));
    }
    anterior = bolas;
  });

  return {
    somaMin: Math.min(...somas),
    somaMax: Math.max(...somas),
    somaMedia: media(somas),
    somaP10: percentil(somas, 10),
    somaP90: percentil(somas, 90),
    paresMin: Math.min(...pares),
    paresMax: Math.max(...pares),
    paresMedia: media(pares),
    paresP10: percentil(pares, 10),
    paresP90: percentil(pares, 90),
    imparesP10: percentil(impares, 10),
    imparesP90: percentil(impares, 90),
    maxConsecutivosMedia: media(maxConsecutivos),
    maxConsecutivosMax: Math.max(...maxConsecutivos),
    repetidosAnteriorMin: repetidos.length ? Math.min(...repetidos) : 0,
    repetidosAnteriorMax: repetidos.length ? Math.max(...repetidos) : 0,
    repetidosAnteriorMedia: media(repetidos),
    repetidosAnteriorP10: percentil(repetidos, 10),
    repetidosAnteriorP90: percentil(repetidos, 90),
    molduraMedia: media(molduras),
    molduraP10: percentil(molduras, 10),
    molduraP90: percentil(molduras, 90),
    primosMedia: media(primos),
    primosP10: percentil(primos, 10),
    primosP90: percentil(primos, 90),
    multiplosMedia: media(multiplos),
    multiplosP10: percentil(multiplos, 10),
    multiplosP90: percentil(multiplos, 90),
    fibonacciMedia: media(fibonaccis),
    fibonacciP10: percentil(fibonaccis, 10),
    fibonacciP90: percentil(fibonaccis, 90),
  };
}
