"use client";
import ErrorWarning from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import { db } from "@/libraries/db";
import { Route } from "@/libraries/routes";
import { Lotofacil } from "@prisma/client";
import { useMemo, useState } from "react";
import Input from "../inputs/Input";

type UltimosConcursosProps = {
  className?: string;
};
export default function UltimosConcursos({
  className = "w-full",
}: UltimosConcursosProps) {
  const { data, isFetching, error } = db.Get<Lotofacil[]>(Route.api.lotofacil);
  const [show, setShow] = useState<number>(10);

  // Maiores sequências (saindo/ausente) de cada número, considerando todo o histórico.
  const { maxAppearances, maxAbsences } = useMemo(
    () => computeStreaks(data ?? []),
    [data]
  );

  if (isFetching)
    return <LoadingData message="Carregando os concursos da Lotofacil" />;
  if (error) return <ErrorWarning message={error.message} />;
  if (!data) return null;

  // Fetch one extra draw before the window so the first visible row can
  // still show how many numbers it repeated from its predecessor.
  const hasPrevious = data.length > show;
  const extendedDraws = data.slice(-show - 1);
  const extendedResults = extendedDraws.map(concursoToResult);
  const resultConcursos = hasPrevious
    ? extendedResults.slice(1)
    : extendedResults;

  const repeatCounts = resultConcursos.map((concurso, index) => {
    const previous = hasPrevious
      ? extendedResults[index]
      : index > 0
      ? extendedResults[index - 1]
      : null;
    return previous ? countRepeats(concurso.bolas, previous.bolas) : null;
  });

  return (
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
      <div className={`overflow-x-auto rounded-lg shadow ${className}`}>
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
            {resultConcursos.map((concurso, index) => {
              const repeated = repeatCounts[index];
              return (
                <tr
                  key={index}
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
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full font-semibold text-xs"
                        style={repeatBadgeStyle(repeated)}
                      >
                        {repeated}
                      </span>
                    )}
                  </td>
                  {Array.from({ length: 25 }, (_, i) => (
                    <td key={i} className="font-normal w-7 min-w-7 max-w-7 p-0.5">
                      {concurso.map[i + 1] ? (
                        <span className="flex h-6 bg-[#7F3992]">
                          &nbsp;
                        </span>
                      ) : (
                        <span className="flex h-6">&nbsp;</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr>
              <td className="sticky left-0 bg-inherit">Totalizadores</td>
              <td></td>
              {Array.from({ length: 25 }, (_, i) => {
                const total = resultConcursos.reduce((acc, cur) => {
                  const saiu = cur.map[i + 1] ? 1 : 0;
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
    </div>
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

  const map: Record<Bola, boolean> = {}; // TODO

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
