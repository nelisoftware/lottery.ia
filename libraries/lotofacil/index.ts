import { extrairBolas, contarPares, contarImpares, contarMaxConsecutivos, soma } from "./numeros";
import { calcularAcertos, conferirHistorico } from "./conferencia";
import {
  calcularCicloConjunto,
  calcularCicloDuplo,
  calcularCicloTriplo,
  calcularCicloDuploNaoSaindo,
  calcularCicloTriploNaoSaindo,
} from "./ciclos";
import { calcularEstatisticas } from "./estatisticas";
import { calcularSequenciasPorNumero } from "./sequencias";
import { gerarCartao, gerarCartoes } from "./gerador";
import { gerarFechamento } from "./fechamento";
import { backtestCartela, backtestMetodoDinamico } from "./backtest";
import { calcularFrequenciaCombinacoes } from "./combinacoes";

export const lotofacil = {
  extrairBolas,
  contarPares,
  contarImpares,
  contarMaxConsecutivos,
  soma,
  calcularAcertos,
  conferirHistorico,
  calcularCicloConjunto,
  calcularCicloDuplo,
  calcularCicloTriplo,
  calcularCicloDuploNaoSaindo,
  calcularCicloTriploNaoSaindo,
  calcularEstatisticas,
  calcularSequenciasPorNumero,
  gerarCartao,
  gerarCartoes,
  gerarFechamento,
  backtestCartela,
  backtestMetodoDinamico,
  calcularFrequenciaCombinacoes,
};

export type { HistoricalAnalysisItem } from "./conferencia";
export type { EstadoCiclo } from "./ciclos";
export type { EstatisticasHistoricas } from "./estatisticas";
export type { SequenciaNumero, StatusSequencia } from "./sequencias";
export type { FiltrosGerador, CartaoGerado } from "./gerador";
export type { ResultadoFechamento } from "./fechamento";
export type { ResultadoBacktest, ResumoBacktest, MetodoDinamico } from "./backtest";
export type { CombinacaoFrequencia } from "./combinacoes";
export * as ciclos from "./ciclos";
