import { Lotofacil } from "@prisma/client";
import { contarPares, extrairBolas } from "./numeros";

/** Únicos splits pares/ímpares matematicamente possíveis (12 pares e 13 ímpares no universo 1~25). */
const QTD_PARES_POSSIVEIS = Array.from({ length: 11 }, (_, i) => i + 2); // [2..12]

export interface EstatisticaParesImpares {
  qtdPares: number; // 2~12
  qtdImpares: number; // 15 - qtdPares
  ocorrencias: number; // vezes que esse split saiu em todo o histórico
  atrasoAtual: number; // concursos seguidos desde a última vez que saiu
  percentual: number; // ocorrencias / total de concursos, em % (não arredondado)
  mediaOcorrencia: number; // round(total / ocorrencias) — o N de "1 em N concursos"
  ultimaOcorrencia: number | null; // concurso.numero da última ocorrência, null se nunca ocorreu
}

/**
 * Para cada split possível de (quantidade de pares, quantidade de ímpares) num
 * sorteio, calcula quantas vezes já ocorreu em todo o histórico, o atraso atual
 * (concursos seguidos sem ocorrer), o percentual de participação, a média de
 * concursos entre ocorrências e o número do concurso da última ocorrência.
 */
export function calcularEstatisticasParesImpares(historico: Lotofacil[]): EstatisticaParesImpares[] {
  const ocorrencias: Record<number, number> = {};
  const atrasoAtual: Record<number, number> = {};
  const ultimaOcorrencia: Record<number, number | null> = {};

  QTD_PARES_POSSIVEIS.forEach((qtdPares) => {
    ocorrencias[qtdPares] = 0;
    atrasoAtual[qtdPares] = 0;
    ultimaOcorrencia[qtdPares] = null;
  });

  historico.forEach((concurso) => {
    const pares = contarPares(extrairBolas(concurso));
    QTD_PARES_POSSIVEIS.forEach((qtdPares) => {
      if (qtdPares === pares) {
        ocorrencias[qtdPares] += 1;
        atrasoAtual[qtdPares] = 0;
        ultimaOcorrencia[qtdPares] = concurso.numero;
      } else {
        atrasoAtual[qtdPares] += 1;
      }
    });
  });

  const total = historico.length;

  return QTD_PARES_POSSIVEIS.map((qtdPares) => ({
    qtdPares,
    qtdImpares: 15 - qtdPares,
    ocorrencias: ocorrencias[qtdPares],
    atrasoAtual: atrasoAtual[qtdPares],
    percentual: total === 0 ? 0 : (ocorrencias[qtdPares] / total) * 100,
    mediaOcorrencia: ocorrencias[qtdPares] === 0 ? 0 : Math.round(total / ocorrencias[qtdPares]),
    ultimaOcorrencia: ultimaOcorrencia[qtdPares],
  }));
}
