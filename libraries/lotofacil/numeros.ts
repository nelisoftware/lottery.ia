import { Lotofacil } from "@prisma/client";

export function extrairBolas(row: Lotofacil): number[] {
  return [
    row.bola01, row.bola02, row.bola03, row.bola04, row.bola05,
    row.bola06, row.bola07, row.bola08, row.bola09, row.bola10,
    row.bola11, row.bola12, row.bola13, row.bola14, row.bola15,
  ];
}

export function contarPares(numeros: number[]): number {
  return numeros.filter((n) => n % 2 === 0).length;
}

export function contarImpares(numeros: number[]): number {
  return numeros.filter((n) => n % 2 !== 0).length;
}

export function soma(numeros: number[]): number {
  return numeros.reduce((total, n) => total + n, 0);
}

/** Quantidade de números em comum entre duas listas (ex.: cartão candidato vs concurso anterior). */
export function contarRepetidos(numeros: number[], anterior: number[]): number {
  const anteriorSet = new Set(anterior);
  return numeros.filter((n) => anteriorSet.has(n)).length;
}

/** Maior sequência de números consecutivos numa lista (a lista não precisa estar ordenada). */
export function contarMaxConsecutivos(numeros: number[]): number {
  if (numeros.length === 0) return 0;
  const ordenados = [...numeros].sort((a, b) => a - b);
  let maior = 1;
  let atual = 1;
  for (let i = 1; i < ordenados.length; i++) {
    if (ordenados[i] === ordenados[i - 1] + 1) {
      atual++;
      maior = Math.max(maior, atual);
    } else {
      atual = 1;
    }
  }
  return maior;
}
