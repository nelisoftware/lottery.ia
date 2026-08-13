import { Lotofacil } from "@prisma/client";
import { extrairBolas } from "./numeros";

/** As 5 linhas do cartão 5x5 da Lotofácil, cada uma com seus 5 números. */
export const LINHAS: number[][] = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25],
];

export const QUANTIDADE_FREQUENCIA_RECENTE = 10;

export interface EstatisticaNumeroLinha {
  numero: number; // 1~25
  frequenciaAtual: number; // quantas vezes saiu nos últimos QUANTIDADE_FREQUENCIA_RECENTE concursos
  atrasoAtual: number; // concursos seguidos sem sair, contando a partir do último concurso
  sequenciaAtual: number; // concursos seguidos saindo, contando a partir do último concurso
  historicoRecente: boolean[]; // saiu/não saiu nos últimos QUANTIDADE_FREQUENCIA_RECENTE concursos (mais antigo -> mais recente)
  percentual: number; // frequenciaAtual / QUANTIDADE_FREQUENCIA_RECENTE, em %
}

/**
 * Para cada número (1~25), calcula o atraso e a sequência atuais com base em
 * todo o histórico, e a frequência, o percentual de participação e o
 * resultado (saiu/não saiu) nos últimos `QUANTIDADE_FREQUENCIA_RECENTE` concursos.
 */
export function calcularEstatisticasLinhas(historico: Lotofacil[]): EstatisticaNumeroLinha[] {
  const atualSequencia: Record<number, number> = {};
  const atualAusencia: Record<number, number> = {};

  for (let n = 1; n <= 25; n++) {
    atualSequencia[n] = 0;
    atualAusencia[n] = 0;
  }

  historico.forEach((concurso) => {
    const saiu = new Set(extrairBolas(concurso));
    for (let n = 1; n <= 25; n++) {
      if (saiu.has(n)) {
        atualSequencia[n] += 1;
        atualAusencia[n] = 0;
      } else {
        atualAusencia[n] += 1;
        atualSequencia[n] = 0;
      }
    }
  });

  const recente = historico.slice(-QUANTIDADE_FREQUENCIA_RECENTE);
  const frequencia: Record<number, number> = {};
  for (let n = 1; n <= 25; n++) frequencia[n] = 0;
  recente.forEach((concurso) => {
    extrairBolas(concurso).forEach((bola) => {
      frequencia[bola] += 1;
    });
  });

  const total = recente.length;

  return Array.from({ length: 25 }, (_, i) => {
    const numero = i + 1;
    return {
      numero,
      frequenciaAtual: frequencia[numero],
      atrasoAtual: atualAusencia[numero],
      sequenciaAtual: atualSequencia[numero],
      historicoRecente: recente.map((concurso) => extrairBolas(concurso).includes(numero)),
      percentual: total === 0 ? 0 : Math.round((frequencia[numero] / total) * 100),
    };
  });
}
