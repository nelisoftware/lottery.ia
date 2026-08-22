"use client";
import ErrorWarning from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import { db } from "@/libraries/db";
import { EstatisticaIntervalo, lotofacil } from "@/libraries/lotofacil";
import { Route } from "@/libraries/routes";
import { Lotofacil } from "@prisma/client";
import { useMemo, useState } from "react";
import { Card } from "../card";
import Input from "../inputs/Input";
import GradeNumeros from "./GradeNumeros";

const TOP_N = 5;

type IntervalosProps = {
  className?: string;
};
export default function Intervalos({ className = "w-full" }: IntervalosProps) {
  const { data, isFetching, error } = db.Get<Lotofacil[]>(Route.api.lotofacil);
  const [show, setShow] = useState<number>(10);

  const estatisticas = useMemo(
    () => lotofacil.calcularEstatisticasIntervalos(data ?? []),
    [data]
  );

  // Maiores sequências (saindo/ausente) de cada número, considerando todo o histórico.
  const { maxAppearances, maxAbsences } = useMemo(
    () => computeStreaks(data ?? []),
    [data]
  );

  if (isFetching)
    return <LoadingData message="Carregando os concursos da Lotofacil" />;
  if (error) return <ErrorWarning message={error.message} />;
  if (!data) return null;

  const totalConcursos = data.length;
  // Um concurso pode ter mais de 1 intervalo, então soma-se via presença por concurso.
  const concursosUnicosComIntervalo = data.filter(
    (concurso) => lotofacil.encontrarIntervalosFaltantes(lotofacil.extrairBolas(concurso)).length > 0
  ).length;
  const percentualGeral = totalConcursos === 0 ? 0 : (concursosUnicosComIntervalo / totalConcursos) * 100;
  const frequenciaMedia = concursosUnicosComIntervalo === 0 ? 0 : Math.round(totalConcursos / concursosUnicosComIntervalo);

  const maisRecorrentes = [...estatisticas].sort((a, b) => b.ocorrencias - a.ocorrencias).slice(0, TOP_N);
  const maisAtrasados = [...estatisticas].sort((a, b) => b.atrasoAtual - a.atrasoAtual).slice(0, TOP_N);

  // Concursos com pelo menos um intervalo faltante ≥ 3, na ordem cronológica original.
  const resultados = data.map(concursoToResult);
  const comIntervalo = resultados
    .map((concurso, index) => {
      const anterior = index > 0 ? resultados[index - 1] : null;
      const repeated = anterior ? countRepeats(concurso.bolas, anterior.bolas) : null;
      const intervalos = lotofacil.encontrarIntervalosFaltantes(concurso.bolas);
      const numerosEmFalta = new Set(intervalos.flatMap((i) => i.numeros));
      return { concurso, repeated, numerosEmFalta };
    })
    .filter((item) => item.numerosEmFalta.size > 0);

  const exibidos = comIntervalo.slice(-show);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <Card.Root className="flex-1 min-w-55">
          <Card.Title title="Resumo" />
          <Card.Content>
            <div className="flex flex-col gap-1 text-sm">
              <span>
                <span className="font-semibold">{concursosUnicosComIntervalo}</span> de {totalConcursos} concursos tiveram intervalo ≥ 3 ({percentualGeral.toFixed(2)}%)
              </span>
              <span>
                Frequência média: {frequenciaMedia === 0 ? "—" : `1 em ${frequenciaMedia} concursos`}
              </span>
            </div>
          </Card.Content>
        </Card.Root>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <TabelaIntervalos titulo="5 Intervalos Mais Recorrentes" itens={maisRecorrentes} />
        <TabelaIntervalos titulo="5 Intervalos Mais Atrasados" itens={maisAtrasados} />
      </div>

      <div className="flex flex-wrap lg:flex-col gap-2">
        <Input
          placeholder="Concursos"
          defaultValue={10}
          type="number"
          id="concurso"
          name="concurso"
          min={1}
          max={1000}
          onChange={(e) => setShow(+e.currentTarget.value)}
          className="w-24"
        />

        {exibidos.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nenhum concurso com intervalo ≥ 3 encontrado.
          </p>
        ) : (
          <>
            {/* Mobile: um card por concurso, sem scroll horizontal */}
            <div className="lg:hidden flex flex-col gap-3 w-full">
              {exibidos.map(({ concurso, repeated, numerosEmFalta }) => (
                <div
                  key={concurso.numero}
                  className="rounded-lg border border-gray-200 dark:border-gray-800 p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Concurso {concurso.numero}</span>
                    {repeated !== null && (
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-md font-semibold text-xs"
                        style={repeatBadgeStyle(repeated)}
                        title="Números repetidos em relação ao concurso anterior"
                      >
                        {repeated}
                      </span>
                    )}
                  </div>
                  <GradeNumeros sorteados={concurso.bolas} destacarFalta={numerosEmFalta} />
                </div>
              ))}
            </div>

            {/* Desktop: matriz completa concurso x número */}
            <div className={`hidden lg:block overflow-x-auto rounded-lg shadow ${className}`}>
              <table
                id="table"
                className="text-sm bg-transparent border-separate border-spacing-0 table-fixed"
              >
                <colgroup>
                  <col className="w-20" />
                  <col className="w-14" />
                  {Array.from({ length: 25 }, (_, i) => (
                    <col key={i} className="w-7 min-w-7 max-w-7" />
                  ))}
                </colgroup>
                <thead>
                  <tr className="bg-sky-950 dark:bg-sky-800 text-sky-100 pl-8 pt-2 text-center sticky top-0 z-10">
                    <th className="pl-2 font-normal sticky left-0 bg-sky-950 dark:bg-sky-800">
                      Concurso
                    </th>
                    <th className="px-2 font-normal whitespace-nowrap" title="Quantos números se repetiram em relação ao concurso anterior">
                      Repetidos
                    </th>
                    {Array.from({ length: 25 }, (_, i) => (
                      <th
                        key={i}
                        className="font-mono text-center w-7 min-w-7 max-w-7"
                      >
                        {i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {exibidos.map(({ concurso, repeated, numerosEmFalta }) => (
                    <tr
                      key={concurso.numero}
                      className="hover:bg-sky-100 dark:hover:bg-sky-900/40"
                    >
                      <td className="flex bg-sky-950 text-sky-100 justify-center sticky left-0">
                        {concurso.numero}
                      </td>
                      <td className="text-center font-mono">
                        {repeated === null ? (
                          <span className="text-slate-400">&mdash;</span>
                        ) : (
                          <span
                            className="inline-flex items-center justify-center w-6 h-6 rounded-md font-semibold text-xs"
                            style={repeatBadgeStyle(repeated)}
                          >
                            {repeated}
                          </span>
                        )}
                      </td>
                      {Array.from({ length: 25 }, (_, i) => {
                        const numero = i + 1;
                        const saiu = concurso.map[numero];
                        const emFalta = !saiu && numerosEmFalta.has(numero);
                        return (
                          <td key={i} className="font-normal w-7 min-w-7 max-w-7 p-0.5">
                            {saiu ? (
                              <span className="flex h-6 bg-[#7F3992]">&nbsp;</span>
                            ) : emFalta ? (
                              <span className="flex h-6 bg-red-500 dark:bg-red-700">&nbsp;</span>
                            ) : (
                              <span className="flex h-6">&nbsp;</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr>
                    <td className="sticky left-0 bg-inherit">Totalizadores</td>
                    <td></td>
                    {Array.from({ length: 25 }, (_, i) => {
                      const total = exibidos.reduce((acc, cur) => {
                        const saiu = cur.concurso.map[i + 1] ? 1 : 0;
                        return acc + saiu;
                      }, 0);

                      return (
                        <td key={i} className="text-center w-7 min-w-7 max-w-7">
                          {total}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td
                      className="sticky left-0 bg-inherit whitespace-nowrap"
                      title="Maior sequência de concursos seguidos em que o número saiu, em todo o histórico"
                    >
                      Máx. sequência
                    </td>
                    <td></td>
                    {Array.from({ length: 25 }, (_, i) => (
                      <td key={i} className="text-center w-7 min-w-7 max-w-7">
                        {maxAppearances[i + 1]}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td
                      className="sticky left-0 bg-inherit whitespace-nowrap"
                      title="Maior sequência de concursos seguidos em que o número NÃO saiu, em todo o histórico"
                    >
                      Máx. ausência
                    </td>
                    <td></td>
                    {Array.from({ length: 25 }, (_, i) => (
                      <td key={i} className="text-center w-7 min-w-7 max-w-7">
                        {maxAbsences[i + 1]}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

type TabelaIntervalosProps = {
  titulo: string;
  itens: EstatisticaIntervalo[];
};

function TabelaIntervalos({ titulo, itens }: TabelaIntervalosProps) {
  return (
    <Card.Root className="w-full">
      <Card.Title title={titulo} />
      <Card.Content>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400">
                <th className="py-1 font-normal">Intervalo</th>
                <th className="py-1 font-normal">Ocorrências</th>
                <th className="py-1 font-normal">Atraso atual</th>
                <th className="py-1 font-normal">Porcentagem</th>
                <th className="py-1 font-normal">Média de ocorrência</th>
                <th className="py-1 font-normal">Última ocorrência</th>
              </tr>
            </thead>
            <tbody>
              {itens.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-2 text-gray-500 dark:text-gray-400">
                    Nenhum intervalo encontrado.
                  </td>
                </tr>
              ) : (
                itens.map((item) => (
                  <tr key={item.chave} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="py-2 font-mono">{item.inicio}-{item.fim}</td>
                    <td className="py-2 font-semibold">{item.ocorrencias}</td>
                    <td className="py-2">{item.atrasoAtual}</td>
                    <td className="py-2">{item.percentual.toFixed(2)}%</td>
                    <td className="py-2">
                      {item.mediaOcorrencia === 0 ? "—" : `1 em ${item.mediaOcorrencia} concursos`}
                    </td>
                    <td className="py-2">{item.ultimaOcorrencia ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card.Content>
    </Card.Root>
  );
}

// -------------------------

type Bola = number; // 1~25

type LotofacilResult = {
  numero: number; // codigo do concurso
  bolas: Bola[];
  map: Record<Bola, boolean>; // [bola] -> saiu
};

function concursoToResult(lotofacil: Lotofacil): LotofacilResult {
  const bolas = [
    lotofacil.bola01,
    lotofacil.bola02,
    lotofacil.bola03,
    lotofacil.bola04,
    lotofacil.bola05,
    lotofacil.bola06,
    lotofacil.bola07,
    lotofacil.bola08,
    lotofacil.bola09,
    lotofacil.bola10,
    lotofacil.bola11,
    lotofacil.bola12,
    lotofacil.bola13,
    lotofacil.bola14,
    lotofacil.bola15,
  ];

  const map: Record<Bola, boolean> = {};

  for (let i = 1; i <= 25; i++) {
    map[i] = bolas.includes(i);
  }

  return {
    numero: lotofacil.numero,
    bolas,
    map,
  };
}

function countRepeats(current: Bola[], previous: Bola[]): number {
  const previousSet = new Set(previous);
  return current.filter((bola) => previousSet.has(bola)).length;
}

type StreakStats = {
  maxAppearances: Record<Bola, number>; // maior sequência de concursos seguidos em que saiu
  maxAbsences: Record<Bola, number>; // maior sequência de concursos seguidos em que não saiu
};

function computeStreaks(draws: Lotofacil[]): StreakStats {
  const maxAppearances: Record<Bola, number> = {};
  const maxAbsences: Record<Bola, number> = {};
  const currentAppearances: Record<Bola, number> = {};
  const currentAbsences: Record<Bola, number> = {};
  for (let n = 1; n <= 25; n++) {
    maxAppearances[n] = 0;
    maxAbsences[n] = 0;
    currentAppearances[n] = 0;
    currentAbsences[n] = 0;
  }

  for (const draw of draws) {
    const { map } = concursoToResult(draw);
    for (let n = 1; n <= 25; n++) {
      if (map[n]) {
        currentAppearances[n] += 1;
        currentAbsences[n] = 0;
        if (currentAppearances[n] > maxAppearances[n]) {
          maxAppearances[n] = currentAppearances[n];
        }
      } else {
        currentAbsences[n] += 1;
        currentAppearances[n] = 0;
        if (currentAbsences[n] > maxAbsences[n]) {
          maxAbsences[n] = currentAbsences[n];
        }
      }
    }
  }

  return { maxAppearances, maxAbsences };
}

// Heatmap: blue (poucas repetições) -> red (muitas repetições), 0~15 acertos.
function repeatBadgeStyle(count: number): { backgroundColor: string; color: string } {
  const ratio = Math.min(Math.max(count, 0), 15) / 15;
  const hue = 220 - ratio * 220;
  return { backgroundColor: `hsl(${hue}, 70%, 45%)`, color: "white" };
}
