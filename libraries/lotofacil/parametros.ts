import { EstatisticasHistoricas } from "./estatisticas";
import {
  contarFibonacci,
  contarImpares,
  contarMoldura,
  contarMultiplos,
  contarPares,
  contarPrimos,
  contarRepetidos,
  soma,
} from "./numeros";

export type StatusParametro = 'padrao' | 'fora_padrao';

export interface ParametroConcurso {
  nome: string;
  valor: number;
  status: StatusParametro;
}

function classificar(valor: number, p10: number, p90: number): StatusParametro {
  return valor >= p10 && valor <= p90 ? 'padrao' : 'fora_padrao';
}

/**
 * Avalia os parâmetros do concurso (ímpares, pares, repetidas, moldura, primos,
 * múltiplos, fibonaccis, soma) e classifica cada um como 'padrao' ou 'fora_padrao'
 * conforme a faixa mais comum (percentil 10-90) observada no histórico real.
 */
export function avaliarParametrosConcurso(
  bolas: number[],
  anterior: number[] | null,
  estatisticas: EstatisticasHistoricas
): ParametroConcurso[] {
  const repetidas = anterior ? contarRepetidos(bolas, anterior) : 0;

  return [
    {
      nome: 'Ímpares',
      valor: contarImpares(bolas),
      status: classificar(contarImpares(bolas), estatisticas.imparesP10, estatisticas.imparesP90),
    },
    {
      nome: 'Pares',
      valor: contarPares(bolas),
      status: classificar(contarPares(bolas), estatisticas.paresP10, estatisticas.paresP90),
    },
    {
      nome: 'Repetidas',
      valor: repetidas,
      status: anterior ? classificar(repetidas, estatisticas.repetidosAnteriorP10, estatisticas.repetidosAnteriorP90) : 'padrao',
    },
    {
      nome: 'Moldura',
      valor: contarMoldura(bolas),
      status: classificar(contarMoldura(bolas), estatisticas.molduraP10, estatisticas.molduraP90),
    },
    {
      nome: 'Primos',
      valor: contarPrimos(bolas),
      status: classificar(contarPrimos(bolas), estatisticas.primosP10, estatisticas.primosP90),
    },
    {
      nome: 'Múltiplos',
      valor: contarMultiplos(bolas),
      status: classificar(contarMultiplos(bolas), estatisticas.multiplosP10, estatisticas.multiplosP90),
    },
    {
      nome: 'Fibonaccis',
      valor: contarFibonacci(bolas),
      status: classificar(contarFibonacci(bolas), estatisticas.fibonacciP10, estatisticas.fibonacciP90),
    },
    {
      nome: 'Soma',
      valor: soma(bolas),
      status: classificar(soma(bolas), estatisticas.somaP10, estatisticas.somaP90),
    },
  ];
}
