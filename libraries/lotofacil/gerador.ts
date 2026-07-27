import { contarMaxConsecutivos, contarPares, contarRepetidos, soma } from "./numeros";

export interface FiltrosGerador {
  quantidadeNumeros: number;
  somaMin: number;
  somaMax: number;
  paresMin: number;
  paresMax: number;
  maxConsecutivos: number;
  poolPermitido?: number[];
  /** Números do último concurso real — necessário para aplicar repetidosAnteriorMin/Max. */
  ultimoConcurso?: number[];
  repetidosAnteriorMin?: number;
  repetidosAnteriorMax?: number;
}

export interface CartaoGerado {
  numeros: number[];
  soma: number;
  pares: number;
  impares: number;
  maxConsecutivos: number;
  /** Quantos números repetem em relação a `ultimoConcurso`; null se não informado. */
  repetidosAnterior: number | null;
}

const TODOS = Array.from({ length: 25 }, (_, i) => i + 1);

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function avaliar(numeros: number[], ultimoConcurso?: number[]): CartaoGerado {
  const p = contarPares(numeros);
  return {
    numeros,
    soma: soma(numeros),
    pares: p,
    impares: numeros.length - p,
    maxConsecutivos: contarMaxConsecutivos(numeros),
    repetidosAnterior: ultimoConcurso ? contarRepetidos(numeros, ultimoConcurso) : null,
  };
}

/**
 * Sorteia candidatos aleatórios dentro do pool permitido e descarta os que não
 * respeitam os filtros — não "prevê" o sorteio, apenas evita combinações
 * estatisticamente atípicas em relação ao histórico real.
 */
export function gerarCartao(filtros: FiltrosGerador, tentativasMax = 2000): CartaoGerado | null {
  const pool = filtros.poolPermitido && filtros.poolPermitido.length > 0 ? filtros.poolPermitido : TODOS;
  if (pool.length < filtros.quantidadeNumeros) return null;

  for (let tentativa = 0; tentativa < tentativasMax; tentativa++) {
    const candidato = embaralhar(pool).slice(0, filtros.quantidadeNumeros).sort((a, b) => a - b);
    const avaliado = avaliar(candidato, filtros.ultimoConcurso);

    if (avaliado.soma < filtros.somaMin || avaliado.soma > filtros.somaMax) continue;
    if (avaliado.pares < filtros.paresMin || avaliado.pares > filtros.paresMax) continue;
    if (avaliado.maxConsecutivos > filtros.maxConsecutivos) continue;
    if (
      avaliado.repetidosAnterior !== null &&
      filtros.repetidosAnteriorMin !== undefined &&
      filtros.repetidosAnteriorMax !== undefined &&
      (avaliado.repetidosAnterior < filtros.repetidosAnteriorMin || avaliado.repetidosAnterior > filtros.repetidosAnteriorMax)
    ) continue;

    return avaliado;
  }

  return null;
}

export function gerarCartoes(filtros: FiltrosGerador, quantidade: number, tentativasMax = 2000): CartaoGerado[] {
  const resultados: CartaoGerado[] = [];
  for (let i = 0; i < quantidade; i++) {
    const cartao = gerarCartao(filtros, tentativasMax);
    if (cartao) resultados.push(cartao);
  }
  return resultados;
}
