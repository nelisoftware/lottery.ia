import {
  extrairBolas,
  contarPares,
  contarImpares,
  contarMaxConsecutivos,
  contarMoldura,
  contarPrimos,
  contarMultiplos,
  contarFibonacci,
  contarRepetidos,
  soma,
} from "./numeros";
import { calcularAcertos, conferirHistorico } from "./conferencia";
import {
  calcularCicloConjunto,
  calcularCicloDuplo,
  calcularCicloTriplo,
  calcularCicloDuploNaoSaindo,
  calcularCicloTriploNaoSaindo,
} from "./ciclos";
import { calcularEstatisticas, percentil } from "./estatisticas";
import { avaliarParametrosConcurso } from "./parametros";
import { calcularSequenciasPorNumero } from "./sequencias";
import { calcularEstatisticasLinhas, LINHAS } from "./linhas";
import { gerarCartao, gerarCartoes } from "./gerador";
import { gerarFechamento } from "./fechamento";
import { backtestCartela, backtestMetodoDinamico } from "./backtest";
import { calcularFrequenciaCombinacoes } from "./combinacoes";
import { calcularEstatisticasParesImpares } from "./paresImpares";
import { encontrarIntervalosFaltantes, calcularEstatisticasIntervalos } from "./intervalos";

export const lotofacil = {
  extrairBolas,
  contarPares,
  contarImpares,
  contarMaxConsecutivos,
  contarMoldura,
  contarPrimos,
  contarMultiplos,
  contarFibonacci,
  contarRepetidos,
  soma,
  calcularAcertos,
  conferirHistorico,
  calcularCicloConjunto,
  calcularCicloDuplo,
  calcularCicloTriplo,
  calcularCicloDuploNaoSaindo,
  calcularCicloTriploNaoSaindo,
  calcularEstatisticas,
  percentil,
  avaliarParametrosConcurso,
  calcularSequenciasPorNumero,
  calcularEstatisticasLinhas,
  LINHAS,
  gerarCartao,
  gerarCartoes,
  gerarFechamento,
  backtestCartela,
  backtestMetodoDinamico,
  calcularFrequenciaCombinacoes,
  calcularEstatisticasParesImpares,
  encontrarIntervalosFaltantes,
  calcularEstatisticasIntervalos,
};

export type { HistoricalAnalysisItem } from "./conferencia";
export type { EstadoCiclo } from "./ciclos";
export type { EstatisticasHistoricas } from "./estatisticas";
export type { StatusParametro, ParametroConcurso } from "./parametros";
export type { SequenciaNumero, StatusSequencia } from "./sequencias";
export type { EstatisticaNumeroLinha } from "./linhas";
export type { FiltrosGerador, CartaoGerado } from "./gerador";
export type { ResultadoFechamento } from "./fechamento";
export type { ResultadoBacktest, ResumoBacktest, MetodoDinamico } from "./backtest";
export type { CombinacaoFrequencia } from "./combinacoes";
export type { EstatisticaParesImpares } from "./paresImpares";
export type { IntervaloFaltante, EstatisticaIntervalo } from "./intervalos";
export * as ciclos from "./ciclos";
