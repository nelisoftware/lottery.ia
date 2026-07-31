"use client";
import ErrorWarning from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import { db } from "@/libraries/db";
import { Icons } from "@/libraries/icons";
import { CombinacaoFrequencia, lotofacil } from "@/libraries/lotofacil";
import { Route } from "@/libraries/routes";
import { Lotofacil } from "@prisma/client";
import { useMemo } from "react";
import { Card } from "../card";
import Numero from "./Numero";

const TOP_N = 30;

export default function RankingCombinacoes() {
  const { data, isFetching, error } = db.Get<Lotofacil[]>(Route.api.lotofacil);

  const duplas = useMemo(
    () => lotofacil.calcularFrequenciaCombinacoes(data ?? [], 2),
    [data]
  );
  const ternos = useMemo(
    () => lotofacil.calcularFrequenciaCombinacoes(data ?? [], 3),
    [data]
  );

  if (isFetching)
    return <LoadingData message="Carregando os concursos da Lotofacil" />;
  if (error) return <ErrorWarning message={error.message} />;
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <TabelaRanking
        titulo="Duplas mais repetidas"
        icon={<Icons.tabler.Repeat />}
        itens={ordenarPor(duplas, "frequencia", TOP_N)}
        totalUniverso={duplas.length}
        campo="frequencia"
        rotuloValor="vezes"
      />
      <TabelaRanking
        titulo="Duplas mais atrasadas"
        icon={<Icons.tabler.ClockPause />}
        itens={ordenarPor(duplas, "atrasoAtual", TOP_N)}
        totalUniverso={duplas.length}
        campo="atrasoAtual"
        rotuloValor="concursos"
      />
      <TabelaRanking
        titulo="Ternos mais repetidos"
        icon={<Icons.tabler.Repeat />}
        itens={ordenarPor(ternos, "frequencia", TOP_N)}
        totalUniverso={ternos.length}
        campo="frequencia"
        rotuloValor="vezes"
      />
      <TabelaRanking
        titulo="Ternos mais atrasados"
        icon={<Icons.tabler.ClockPause />}
        itens={ordenarPor(ternos, "atrasoAtual", TOP_N)}
        totalUniverso={ternos.length}
        campo="atrasoAtual"
        rotuloValor="concursos"
      />
    </div>
  );
}

function ordenarPor(
  itens: CombinacaoFrequencia[],
  campo: "frequencia" | "atrasoAtual",
  limite: number
): CombinacaoFrequencia[] {
  return [...itens].sort((a, b) => b[campo] - a[campo]).slice(0, limite);
}

type TabelaRankingProps = {
  titulo: string;
  icon: React.ReactNode;
  itens: CombinacaoFrequencia[];
  totalUniverso: number;
  campo: "frequencia" | "atrasoAtual";
  rotuloValor: string;
};

function TabelaRanking({
  titulo,
  icon,
  itens,
  totalUniverso,
  campo,
  rotuloValor,
}: TabelaRankingProps) {
  return (
    <Card.Root className="w-full">
      <Card.Title
        title={`${titulo} (top ${itens.length} de ${totalUniverso})`}
        icon={icon}
      />
      <Card.Content>
        <div className="flex flex-col gap-1 max-h-[32rem] overflow-y-auto">
          {itens.map((item, index) => (
            <div
              key={item.chave}
              className="flex items-center gap-2 py-1 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <span className="w-6 shrink-0 text-right text-xs tabular-nums text-slate-500 dark:text-slate-400">
                {index + 1}º
              </span>
              <div className="flex gap-1 flex-1">
                {item.numeros.map((numero) => (
                  <Numero key={numero} number={numero} />
                ))}
              </div>
              <span className="w-24 shrink-0 text-right text-sm font-semibold tabular-nums">
                {item[campo]}{" "}
                <span className="font-normal text-xs text-slate-500 dark:text-slate-400">
                  {rotuloValor}
                </span>
              </span>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card.Root>
  );
}
