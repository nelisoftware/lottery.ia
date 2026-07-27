import { Lotofacil } from "@prisma/client";
import { extrairBolas } from "./numeros";

export type StatusSequencia = "saindo" | "ausente";

export interface SequenciaNumero {
  numero: number; // 1~25
  maxSequencia: number; // maior sequência de concursos seguidos em que o número saiu
  maxAusencia: number; // maior sequência de concursos seguidos em que o número NÃO saiu
  atual: number; // tamanho da sequência em andamento (contando a partir do último concurso)
  status: StatusSequencia; // se a sequência em andamento é de números saindo ou ausente
}

/**
 * Para cada número (1~25), calcula a maior sequência de concursos seguidos em
 * que saiu, a maior sequência de concursos seguidos em que não saiu, e a
 * sequência (saindo ou ausente) em andamento até o último concurso do histórico.
 */
export function calcularSequenciasPorNumero(historico: Lotofacil[]): SequenciaNumero[] {
  const maxSequencia: Record<number, number> = {};
  const maxAusencia: Record<number, number> = {};
  const atualSequencia: Record<number, number> = {};
  const atualAusencia: Record<number, number> = {};

  for (let n = 1; n <= 25; n++) {
    maxSequencia[n] = 0;
    maxAusencia[n] = 0;
    atualSequencia[n] = 0;
    atualAusencia[n] = 0;
  }

  for (const concurso of historico) {
    const saiu = new Set(extrairBolas(concurso));
    for (let n = 1; n <= 25; n++) {
      if (saiu.has(n)) {
        atualSequencia[n] += 1;
        atualAusencia[n] = 0;
        if (atualSequencia[n] > maxSequencia[n]) maxSequencia[n] = atualSequencia[n];
      } else {
        atualAusencia[n] += 1;
        atualSequencia[n] = 0;
        if (atualAusencia[n] > maxAusencia[n]) maxAusencia[n] = atualAusencia[n];
      }
    }
  }

  return Array.from({ length: 25 }, (_, i) => {
    const numero = i + 1;
    const status: StatusSequencia = atualSequencia[numero] > 0 ? "saindo" : "ausente";
    const atual = status === "saindo" ? atualSequencia[numero] : atualAusencia[numero];
    return {
      numero,
      maxSequencia: maxSequencia[numero],
      maxAusencia: maxAusencia[numero],
      atual,
      status,
    };
  });
}
