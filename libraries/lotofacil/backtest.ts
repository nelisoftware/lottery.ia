import { Lotofacil } from "@prisma/client";
import { DateTime } from "luxon";
import { calcularAcertos, conferirHistorico, HistoricalAnalysisItem } from "./conferencia";
import { extrairBolas } from "./numeros";

/** Preço da aposta (Caixa) por quantidade de números marcados. */
const CUSTO_APOSTA: Record<number, number> = {
  15: 3.5,
  16: 56,
  17: 476,
  18: 2856,
  19: 13566,
  20: 54264,
};

/** Prêmio fixo por faixa de acerto. 14 e 15 são variáveis (dependem do rateio) — não entram no retorno estimado. */
const PREMIO_FIXO: Partial<Record<11 | 12 | 13 | 14 | 15, number>> = {
  11: 7,
  12: 14,
  13: 35,
};

export interface ResumoBacktest {
  totalConcursos: number;
  custoTotalEstimado: number | null;
  retornoEstimado: number;
  concursosSemEstimativaDeRetorno: number;
  porFaixa: Record<11 | 12 | 13 | 14 | 15, number>;
}

export interface ResultadoBacktest {
  detalhes: HistoricalAnalysisItem[];
  resumo: ResumoBacktest;
}

function resumirDetalhes(
  detalhes: HistoricalAnalysisItem[],
  quantidadeNumerosAposta: number,
  totalConcursosConsiderados: number
): ResumoBacktest {
  const porFaixa: Record<11 | 12 | 13 | 14 | 15, number> = { 11: 0, 12: 0, 13: 0, 14: 0, 15: 0 };
  let retornoEstimado = 0;
  let concursosSemEstimativaDeRetorno = 0;

  detalhes.forEach(item => {
    if (!item.prizeLevel) return;
    const faixa = item.prizeLevel as 11 | 12 | 13 | 14 | 15;
    porFaixa[faixa]++;
    const premio = PREMIO_FIXO[faixa];
    if (premio !== undefined) {
      retornoEstimado += premio;
    } else {
      concursosSemEstimativaDeRetorno++;
    }
  });

  const custoPorAposta = CUSTO_APOSTA[quantidadeNumerosAposta] ?? null;

  return {
    totalConcursos: totalConcursosConsiderados,
    custoTotalEstimado: custoPorAposta !== null ? custoPorAposta * totalConcursosConsiderados : null,
    retornoEstimado,
    concursosSemEstimativaDeRetorno,
    porFaixa,
  };
}

/** Confere uma cartela fixa contra todo o histórico. */
export function backtestCartela(cartela: number[], historico: Lotofacil[]): ResultadoBacktest {
  const detalhes = conferirHistorico(cartela, historico);
  return { detalhes, resumo: resumirDetalhes(detalhes, cartela.length, historico.length) };
}

export type MetodoDinamico = "mais-frequentes" | "menos-frequentes";

function escolherCartaoPorFrequencia(
  frequencia: Map<number, number>,
  metodo: MetodoDinamico,
  quantidade: number
): number[] {
  const ordenado = Array.from(frequencia.entries()).sort((a, b) =>
    metodo === "mais-frequentes" ? b[1] - a[1] : a[1] - b[1]
  );
  return ordenado.slice(0, quantidade).map(([numero]) => numero).sort((a, b) => a - b);
}

/**
 * Simula um método dinâmico (ex.: "sempre jogar os 15 números mais frequentes
 * até aquele momento") concurso a concurso, usando em cada decisão apenas os
 * dados anteriores ao concurso avaliado — nunca a frequência acumulada de
 * hoje. Sem isso o backtest "olharia o futuro" e infla o resultado.
 *
 * @param historicoOrdenado histórico ordenado do concurso mais antigo para o mais recente.
 * @param janelaMinima quantos concursos usar de aquecimento antes de começar a apostar.
 */
export function backtestMetodoDinamico(
  metodo: MetodoDinamico,
  historicoOrdenado: Lotofacil[],
  quantidadeNumeros = 15,
  janelaMinima = 10
): ResultadoBacktest {
  const frequencia = new Map<number, number>();
  for (let n = 1; n <= 25; n++) frequencia.set(n, 0);

  const detalhes: HistoricalAnalysisItem[] = [];

  historicoOrdenado.forEach((concurso, indice) => {
    const sorteio = extrairBolas(concurso);

    if (indice >= janelaMinima) {
      const cartao = escolherCartaoPorFrequencia(frequencia, metodo, quantidadeNumeros);
      const hits = calcularAcertos(cartao, sorteio);
      detalhes.push({
        concurso: concurso.numero,
        date: DateTime.fromJSDate(new Date(concurso.dataApuracao)).toFormat("dd/MM/yyyy"),
        hits,
        prizeLevel: hits >= 11 ? hits : null,
      });
    }

    // só entra nas estatísticas usadas pela PRÓXIMA decisão — nunca influencia a decisão atual.
    sorteio.forEach(n => frequencia.set(n, (frequencia.get(n) ?? 0) + 1));
  });

  return { detalhes, resumo: resumirDetalhes(detalhes, quantidadeNumeros, detalhes.length) };
}
