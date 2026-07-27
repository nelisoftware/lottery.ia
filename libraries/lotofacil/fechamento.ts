export interface ResultadoFechamento {
  cartelas: number[][];
  /**
   * true somente quando cobrimos TODAS as combinações possíveis do pool
   * (cobertura exaustiva) — nesse caso há garantia matemática formal: se j dos
   * números sorteados estiverem no pool, alguma cartela terá min(j, tamanhoCartela)
   * acertos. Quando false, as cartelas vêm de uma heurística de cobertura de
   * pares (garante que todo par do pool aparece junto em pelo menos uma
   * cartela), sem garantia formal de prêmio mínimo.
   */
  garantiaFormal: boolean;
}

function combinacoes<T>(lista: T[], tamanho: number): T[][] {
  const resultado: T[][] = [];
  function combinar(inicio: number, atual: T[]) {
    if (atual.length === tamanho) {
      resultado.push([...atual]);
      return;
    }
    for (let i = inicio; i < lista.length; i++) {
      atual.push(lista[i]);
      combinar(i + 1, atual);
      atual.pop();
    }
  }
  combinar(0, []);
  return resultado;
}

function chaveParDe(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function cobrirPares(pool: number[], tamanhoCartela: number, maxCartelas: number): number[][] {
  const paresRestantes = new Set<string>();
  for (let i = 0; i < pool.length; i++) {
    for (let j = i + 1; j < pool.length; j++) {
      paresRestantes.add(chaveParDe(pool[i], pool[j]));
    }
  }

  const cartelas: number[][] = [];

  while (paresRestantes.size > 0 && cartelas.length < maxCartelas) {
    const cartela: number[] = [];
    let candidatos = [...pool];

    while (cartela.length < tamanhoCartela && candidatos.length > 0) {
      let melhor = candidatos[0];
      let melhorScore = -1;
      for (const candidato of candidatos) {
        let score = cartela.length === 0 ? 1 : 0;
        for (const n of cartela) {
          if (paresRestantes.has(chaveParDe(n, candidato))) score++;
        }
        if (score > melhorScore) {
          melhorScore = score;
          melhor = candidato;
        }
      }
      cartela.push(melhor);
      candidatos = candidatos.filter(c => c !== melhor);
    }

    cartela.sort((a, b) => a - b);
    for (let i = 0; i < cartela.length; i++) {
      for (let j = i + 1; j < cartela.length; j++) {
        paresRestantes.delete(chaveParDe(cartela[i], cartela[j]));
      }
    }
    cartelas.push(cartela);
  }

  return cartelas;
}

/**
 * Gera um conjunto reduzido de cartelas cobrindo um pool de números escolhido
 * pelo usuário. Quando o pool cabe inteiro numa cobertura exaustiva (até 20
 * números — o mesmo limite máximo de uma aposta da Caixa, no máximo 15504
 * cartelas), gera todas as combinações possíveis com garantia formal. Acima
 * disso usa uma heurística de cobertura de pares, sem garantia formal.
 */
export function gerarFechamento(
  pool: number[],
  tamanhoCartela = 15,
  maxCartelasHeuristica = 300
): ResultadoFechamento {
  const poolOrdenado = Array.from(new Set(pool)).sort((a, b) => a - b);

  if (poolOrdenado.length < tamanhoCartela) {
    return { cartelas: [], garantiaFormal: false };
  }

  if (poolOrdenado.length <= 20) {
    return { cartelas: combinacoes(poolOrdenado, tamanhoCartela), garantiaFormal: true };
  }

  return { cartelas: cobrirPares(poolOrdenado, tamanhoCartela, maxCartelasHeuristica), garantiaFormal: false };
}
