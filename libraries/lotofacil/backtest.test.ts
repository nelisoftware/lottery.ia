import { describe, expect, it } from "vitest";
import { backtestCartela, backtestMetodoDinamico } from "./backtest";
import { Lotofacil } from "@prisma/client";

function criarSorteio(numero: number, bolas: number[], dataApuracao = new Date("2024-01-01")): Lotofacil {
  const row: Partial<Lotofacil> = { numero, dataApuracao, ganhadores: 0 };
  bolas.forEach((bola, i) => {
    (row as Record<string, number>)[`bola${String(i + 1).padStart(2, "0")}`] = bola;
  });
  return row as Lotofacil;
}

describe("backtestCartela", () => {
  it("resume acertos, custo e retorno estimado", () => {
    const cartela = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const historico = [
      criarSorteio(1, cartela), // 15 acertos
      criarSorteio(2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 16, 17, 18, 19]), // 11 acertos
      criarSorteio(3, [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 1, 2, 3, 4, 5]), // 5 acertos
    ];

    const resultado = backtestCartela(cartela, historico);

    expect(resultado.resumo.totalConcursos).toBe(3);
    expect(resultado.resumo.porFaixa[15]).toBe(1);
    expect(resultado.resumo.porFaixa[11]).toBe(1);
    expect(resultado.resumo.retornoEstimado).toBe(7); // só o de 11 pontos tem prêmio fixo somável
    expect(resultado.resumo.concursosSemEstimativaDeRetorno).toBe(1); // o de 15 pontos é variável
    expect(resultado.resumo.custoTotalEstimado).toBeCloseTo(3.5 * 3);
  });

  it("custoTotalEstimado é null para uma quantidade de números fora da tabela de preços", () => {
    const cartela = Array.from({ length: 21 }, (_, i) => i + 1);
    const resultado = backtestCartela(cartela, []);
    expect(resultado.resumo.custoTotalEstimado).toBeNull();
  });
});

describe("backtestMetodoDinamico", () => {
  it("nunca usa dados do próprio concurso avaliado ou de concursos futuros (sem look-ahead)", () => {
    // Um número (25) só aparece já perto do fim; se o método "olhasse o futuro"
    // ele apareceria escolhido bem antes de qualquer ocorrência real.
    const historico: Lotofacil[] = [];
    for (let i = 1; i <= 30; i++) {
      // concursos 1-29: só números 1-15 saem sempre; concurso 30: número 25 aparece pela 1a vez
      const bolas = i < 30
        ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 25];
      historico.push(criarSorteio(i, bolas));
    }

    const resultado = backtestMetodoDinamico("mais-frequentes", historico, 15, 5);

    // no concurso 30 (índice 29), a frequência usada na decisão só contempla os concursos 1-29,
    // onde 25 nunca apareceu — então o método não poderia tê-lo escolhido.
    const ultimo = resultado.detalhes[resultado.detalhes.length - 1];
    expect(ultimo.concurso).toBe(30);
    expect(ultimo.hits).toBe(14); // acertou 1-14, não podia ter acertado o 25 (não tinha como prever)
  });

  it("respeita a janela mínima de aquecimento antes de começar a apostar", () => {
    const historico: Lotofacil[] = [];
    for (let i = 1; i <= 12; i++) {
      historico.push(criarSorteio(i, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]));
    }

    const resultado = backtestMetodoDinamico("mais-frequentes", historico, 15, 10);
    expect(resultado.detalhes).toHaveLength(2); // só concursos com índice >= 10 (11º e 12º)
  });

  it("'menos-frequentes' prioriza números que saíram menos até o momento", () => {
    const historico: Lotofacil[] = [];
    for (let i = 1; i <= 11; i++) {
      historico.push(criarSorteio(i, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]));
    }
    const resultado = backtestMetodoDinamico("menos-frequentes", historico, 15, 10);
    // até o concurso 11 (índice 10), os números 16-25 nunca saíram (frequência 0),
    // então "menos-frequentes" deveria escolher os 10 restantes empatados por ordem + os 5 primeiros de 1-15
    expect(resultado.detalhes).toHaveLength(1);
    expect(resultado.detalhes[0].hits).toBeLessThanOrEqual(5); // no máximo 5 dos 1-15 escolhidos entram na cartela de 15
  });
});
