import { Lotofacil } from "@prisma/client";
import { extrairBolas } from "./numeros";

const TAMANHO_MINIMO = 3;

export interface IntervaloFaltante {
  inicio: number;
  fim: number;
  numeros: number[]; // ex.: [17,18,19]
}

/** Sequências de `tamanhoMinimo`+ números (1-25) consecutivos que NÃO saíram nesse sorteio. */
export function encontrarIntervalosFaltantes(
  numeros: number[],
  tamanhoMinimo = TAMANHO_MINIMO
): IntervaloFaltante[] {
  const set = new Set(numeros);
  const intervalos: IntervaloFaltante[] = [];
  let atual: number[] = [];
  const fechar = () => {
    if (atual.length >= tamanhoMinimo) {
      intervalos.push({ inicio: atual[0], fim: atual[atual.length - 1], numeros: [...atual] });
    }
    atual = [];
  };
  for (let n = 1; n <= 25; n++) {
    set.has(n) ? fechar() : atual.push(n);
  }
  fechar();
  return intervalos;
}

export interface EstatisticaIntervalo {
  chave: string; // "17-19"
  inicio: number;
  fim: number;
  tamanho: number;
  ocorrencias: number;
  atrasoAtual: number; // concursos seguidos desde a última vez que esse intervalo exato ocorreu
  percentual: number;
  mediaOcorrencia: number; // "1 em N concursos"
  ultimaOcorrencia: number | null;
}

/**
 * Para cada intervalo exato (ex.: 17-19) de `tamanhoMinimo`+ números seguidos que já
 * faltou em algum concurso do histórico, calcula ocorrências, atraso atual, percentual,
 * média de concursos entre ocorrências e o número da última ocorrência.
 */
export function calcularEstatisticasIntervalos(historico: Lotofacil[]): EstatisticaIntervalo[] {
  const ocorrencias: Record<string, number> = {};
  const atrasoAtual: Record<string, number> = {};
  const ultimaOcorrencia: Record<string, number | null> = {};
  const info: Record<string, { inicio: number; fim: number }> = {};

  historico.forEach((concurso) => {
    const encontrados = encontrarIntervalosFaltantes(extrairBolas(concurso));
    const chavesDoConcurso = new Set(encontrados.map((i) => `${i.inicio}-${i.fim}`));

    Object.keys(atrasoAtual).forEach((chave) => {
      if (!chavesDoConcurso.has(chave)) atrasoAtual[chave] += 1;
    });

    encontrados.forEach((intervalo) => {
      const chave = `${intervalo.inicio}-${intervalo.fim}`;
      if (!(chave in ocorrencias)) {
        ocorrencias[chave] = 0;
        atrasoAtual[chave] = 0;
        ultimaOcorrencia[chave] = null;
        info[chave] = { inicio: intervalo.inicio, fim: intervalo.fim };
      }
      ocorrencias[chave] += 1;
      atrasoAtual[chave] = 0;
      ultimaOcorrencia[chave] = concurso.numero;
    });
  });

  const total = historico.length;

  return Object.keys(info).map((chave) => ({
    chave,
    inicio: info[chave].inicio,
    fim: info[chave].fim,
    tamanho: info[chave].fim - info[chave].inicio + 1,
    ocorrencias: ocorrencias[chave],
    atrasoAtual: atrasoAtual[chave],
    percentual: total === 0 ? 0 : (ocorrencias[chave] / total) * 100,
    mediaOcorrencia: ocorrencias[chave] === 0 ? 0 : Math.round(total / ocorrencias[chave]),
    ultimaOcorrencia: ultimaOcorrencia[chave],
  }));
}
