import { Lotofacil } from "@prisma/client";
import { extrairBolas } from "./numeros";
import { combinacoes } from "./fechamento";

export interface CombinacaoFrequencia {
  numeros: number[]; // ex.: [3, 17] ou [3, 17, 22]
  chave: string; // "3-17" — para lookup/teste
  frequencia: number; // quantas vezes saiu junta em todo o histórico
  atrasoAtual: number; // concursos seguidos até o último sem sair junta
  atrasoRecorde: number; // maior atraso já registrado
}

function chaveDe(numeros: number[]): string {
  return numeros.join("-");
}

const UNIVERSO_25 = Array.from({ length: 25 }, (_, i) => i + 1);

/**
 * Para cada combinação possível de `tamanho` números dentre os 25, calcula
 * quantas vezes ela já saiu junta em todo o histórico e o maior/atual atraso
 * (concursos seguidos sem sair junta), no mesmo espírito de
 * `calcularSequenciasPorNumero` — mas aplicado a duplas/ternos em vez de
 * números individuais.
 */
export function calcularFrequenciaCombinacoes(
  historico: Lotofacil[],
  tamanho: 2 | 3
): CombinacaoFrequencia[] {
  const universo = combinacoes(UNIVERSO_25, tamanho);

  const resultado: CombinacaoFrequencia[] = universo.map((numeros) => ({
    numeros,
    chave: chaveDe(numeros),
    frequencia: 0,
    atrasoAtual: 0,
    atrasoRecorde: 0,
  }));

  for (const concurso of historico) {
    const bolas = extrairBolas(concurso).sort((a, b) => a - b);
    const sorteadasNoConcurso = new Set(
      combinacoes(bolas, tamanho).map(chaveDe)
    );

    for (const item of resultado) {
      if (sorteadasNoConcurso.has(item.chave)) {
        item.frequencia += 1;
        item.atrasoAtual = 0;
      } else {
        item.atrasoAtual += 1;
        if (item.atrasoAtual > item.atrasoRecorde) {
          item.atrasoRecorde = item.atrasoAtual;
        }
      }
    }
  }

  return resultado;
}
