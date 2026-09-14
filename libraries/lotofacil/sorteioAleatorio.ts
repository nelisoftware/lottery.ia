import { sortearCartelasUnicas } from "./escalonamento";

export interface ResultadoSorteioAleatorio {
  cartelas: number[][];
  solicitado: number;
}

/**
 * Sorteia `quantidade` cartelas aleatórias e únicas de `tamanhoCartela` números,
 * usando somente números do `pool` informado. Diferente do fechamento (que busca
 * cobertura exaustiva ou heurística de pares), aqui é uma amostragem aleatória
 * simples — cada tentativa é uma cartela candidata, descartada se já saiu antes.
 * Se o pool não comportar `quantidade` cartelas distintas dentro de `tentativasMax`
 * tentativas, retorna as que conseguiu (menos que o solicitado).
 */
export function gerarSorteioAleatorio(
  pool: number[],
  tamanhoCartela: number,
  quantidade: number,
  tentativasMax = 2000
): ResultadoSorteioAleatorio {
  const poolOrdenado = Array.from(new Set(pool)).sort((a, b) => a - b);

  if (tamanhoCartela < 15 || tamanhoCartela > 20) {
    throw new Error('O tamanho da cartela deve ser entre 15 e 20.');
  }
  if (poolOrdenado.length < tamanhoCartela) {
    throw new Error('O pool de números deve ter ao menos o tamanho da cartela.');
  }
  if (quantidade < 1) {
    throw new Error('Informe uma quantidade de cartões maior que zero.');
  }

  const cartelas = sortearCartelasUnicas(poolOrdenado, tamanhoCartela, quantidade, tentativasMax);
  return { cartelas, solicitado: quantidade };
}
