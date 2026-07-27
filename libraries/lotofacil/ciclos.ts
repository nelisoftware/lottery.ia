export interface EstadoCiclo {
  numeros: string;
  completo: boolean;
}

export const SIMPLES = Array.from({ length: 25 }, (_, i) => i + 1);
export const LINHA1 = [1, 2, 3, 4, 5];
export const LINHA2 = [6, 7, 8, 9, 10];
export const LINHA3 = [11, 12, 13, 14, 15];
export const LINHA4 = [16, 17, 18, 19, 20];
export const LINHA5 = [21, 22, 23, 24, 25];
export const COLUNA1 = [1, 6, 11, 16, 21];
export const COLUNA2 = [2, 7, 12, 17, 22];
export const COLUNA3 = [3, 8, 13, 18, 23];
export const COLUNA4 = [4, 9, 14, 19, 24];
export const COLUNA5 = [5, 10, 15, 20, 25];
export const PARES = SIMPLES.filter(n => n % 2 === 0);
export const IMPARES = SIMPLES.filter(n => n % 2 !== 0);
export const DUPLAS_ADJACENTES = Array.from({ length: 24 }, (_, i) => `${i + 1}-${i + 2}`);
export const TRIPLAS_ADJACENTES = Array.from({ length: 23 }, (_, i) => `${i + 1}-${i + 2}-${i + 3}`);

function finalizar(restantes: string[]): EstadoCiclo {
  let numeros = "";
  if (restantes.length !== 0) {
    restantes.forEach(item => (numeros += item + ";"));
  }
  return { numeros, completo: numeros === "" };
}

/**
 * Ciclo por conjunto fixo de números: usado por Simples (1-25), Linha1-5,
 * Coluna1-5 e Pares/Ímpares — todos seguem a mesma regra (remove do conjunto
 * restante os números sorteados; quando o conjunto esvazia, o ciclo fecha e
 * reinicia com o conjunto completo).
 */
export function calcularCicloConjunto(
  universo: number[],
  estadoAnterior: string,
  dezenasSorteadas: number[]
): EstadoCiclo {
  let restantes = universo;
  if (estadoAnterior !== "") {
    const numerosStr = estadoAnterior.split(";");
    restantes = restantes.filter(numero => numerosStr.includes(numero + ""));
  }
  restantes = restantes.filter(numero => !dezenasSorteadas.includes(numero));
  return finalizar(restantes.map(String));
}

/** Ciclo das duplas adjacentes (ex.: "1-2") que ainda não saíram juntas num mesmo concurso. */
export function calcularCicloDuplo(estadoAnterior: string, dezenasSorteadas: number[]): EstadoCiclo {
  let duplas = DUPLAS_ADJACENTES;
  if (estadoAnterior !== "") {
    const numerosStr = estadoAnterior.split(";");
    duplas = duplas.filter(duo => numerosStr.includes(duo));
  }
  let anterior = dezenasSorteadas[0];
  dezenasSorteadas.forEach(dezena => {
    if (dezena - 1 === anterior) {
      const duo = anterior + "-" + dezena;
      duplas = duplas.filter(d => d !== duo);
    }
    anterior = dezena;
  });
  return finalizar(duplas);
}

/** Ciclo das triplas adjacentes (ex.: "1-2-3") que ainda não saíram juntas num mesmo concurso. */
export function calcularCicloTriplo(estadoAnterior: string, dezenasSorteadas: number[]): EstadoCiclo {
  let triplas = TRIPLAS_ADJACENTES;
  if (estadoAnterior !== "") {
    const numerosStr = estadoAnterior.split(";");
    triplas = triplas.filter(triple => numerosStr.includes(triple));
  }
  let primeiro = 0;
  let segundo = 0;
  dezenasSorteadas.forEach(dezena => {
    if (dezena - 2 === primeiro && dezena - 1 === segundo) {
      const triple = primeiro + "-" + segundo + "-" + dezena;
      triplas = triplas.filter(t => t !== triple);
    }
    primeiro = segundo;
    segundo = dezena;
  });
  return finalizar(triplas);
}

/**
 * Ciclo inverso: pareia a cada 2ª ausência encontrada (varrendo 1-25 em ordem)
 * com o valor imediatamente anterior a ela — não com a ausência anterior real.
 * Coincide com "duplas realmente ausentes em sequência" quando as duas ausências
 * têm valores consecutivos; comportamento herdado do algoritmo original.
 */
export function calcularCicloDuploNaoSaindo(estadoAnterior: string, dezenasSorteadas: number[]): EstadoCiclo {
  let duplas = DUPLAS_ADJACENTES;
  if (estadoAnterior !== "") {
    const numerosStr = estadoAnterior.split(";");
    duplas = duplas.filter(duo => numerosStr.includes(duo));
  }
  let ausentesSeguidos = 0;
  for (let i = 1; i <= 25; i++) {
    if (!dezenasSorteadas.includes(i)) {
      ausentesSeguidos++;
    }
    if (ausentesSeguidos === 2) {
      const duo = i - 1 + "-" + i;
      duplas = duplas.filter(d => d !== duo);
      ausentesSeguidos = 1;
    }
  }
  return finalizar(duplas);
}

/**
 * Ciclo inverso para triplas (mesma ressalva de `calcularCicloDuploNaoSaindo`,
 * agora a cada 3ª ausência encontrada).
 */
export function calcularCicloTriploNaoSaindo(estadoAnterior: string, dezenasSorteadas: number[]): EstadoCiclo {
  let triplas = TRIPLAS_ADJACENTES;
  if (estadoAnterior !== "") {
    const numerosStr = estadoAnterior.split(";");
    triplas = triplas.filter(triple => numerosStr.includes(triple));
  }
  let ausentesSeguidos = 0;
  for (let i = 1; i <= 25; i++) {
    if (!dezenasSorteadas.includes(i)) {
      ausentesSeguidos++;
    }
    if (ausentesSeguidos === 3) {
      const triple = i - 2 + "-" + (i - 1) + "-" + i;
      triplas = triplas.filter(t => t !== triple);
      ausentesSeguidos = 2;
    }
  }
  return finalizar(triplas);
}
