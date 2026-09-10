export interface IntervaloEscalonado {
  escalonados: [number, number];
  pool: number[];
  cartelas: number[][];
}

export interface ResultadoEscalonamento {
  fixos: number[];
  tamanhoCartela: number;
  cartoesPorIntervalo: number;
  intervalos: IntervaloEscalonado[];
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

function sortearCartelasUnicas(pool: number[], tamanho: number, quantidade: number, tentativasMax = 500): number[][] {
  const vistos = new Set<string>();
  const cartelas: number[][] = [];
  for (let tentativa = 0; tentativa < tentativasMax && cartelas.length < quantidade; tentativa++) {
    const candidata = embaralhar(pool).slice(0, tamanho).sort((a, b) => a - b);
    const chave = candidata.join(',');
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    cartelas.push(candidata);
  }
  return cartelas;
}

/**
 * Fechamento por números fixos + escalonamento: 3 números ficam sempre de fora
 * ("fixos") e uma janela de 2 números desliza (passo 1, com sobreposição) pelos
 * outros 22 números até cobrir todos. Em cada posição da janela, os 5 números
 * excluídos (3 fixos + 2 escalonados) deixam um pool de 20 números, do qual
 * sorteamos `cartoesPorIntervalo` cartelas distintas de `tamanhoCartela` números.
 */
export function gerarEscalonamento(
  fixos: number[],
  tamanhoCartela: number,
  cartoesPorIntervalo: number
): ResultadoEscalonamento {
  const fixosOrdenados = Array.from(new Set(fixos)).sort((a, b) => a - b);

  if (fixosOrdenados.length !== 3 || fixosOrdenados.some(n => n < 1 || n > 25)) {
    throw new Error('Informe exatamente 3 números fixos, entre 1 e 25.');
  }
  if (tamanhoCartela < 15 || tamanhoCartela > 20) {
    throw new Error('O tamanho da cartela deve ser entre 15 e 20.');
  }

  const fixosSet = new Set(fixosOrdenados);
  const restantes = TODOS.filter(n => !fixosSet.has(n));

  const intervalos: IntervaloEscalonado[] = [];
  for (let i = 0; i < restantes.length - 1; i++) {
    const escalonados: [number, number] = [restantes[i], restantes[i + 1]];
    const excluidos = new Set([...fixosOrdenados, ...escalonados]);
    const pool = TODOS.filter(n => !excluidos.has(n));
    const cartelas = sortearCartelasUnicas(pool, tamanhoCartela, cartoesPorIntervalo);
    intervalos.push({ escalonados, pool, cartelas });
  }

  return { fixos: fixosOrdenados, tamanhoCartela, cartoesPorIntervalo, intervalos };
}
