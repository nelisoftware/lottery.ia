'use client';
import ErrorWaring from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import { db } from "@/libraries/db";
import { EstatisticaNumeroLinha, lotofacil } from "@/libraries/lotofacil";
import { Route } from "@/libraries/routes";
import { Lotofacil } from "@prisma/client";
import { useMemo, useState } from "react";
import Numero from "./Numero";

const FAIXAS_PERCENTUAL = [
  { min: 60, cor: "bg-emerald-500 dark:bg-emerald-600", label: "60% ou mais" },
  { min: 45, cor: "bg-amber-500 dark:bg-amber-600", label: "45% a 59%" },
  { min: 25, cor: "bg-sky-500 dark:bg-sky-600", label: "25% a 44%" },
  { min: 0, cor: "bg-slate-400 dark:bg-slate-600", label: "Abaixo de 25%" },
];

function corPercentual(percentual: number): string {
  return (FAIXAS_PERCENTUAL.find((faixa) => percentual >= faixa.min) ?? FAIXAS_PERCENTUAL[FAIXAS_PERCENTUAL.length - 1]).cor;
}

export default function Linhas() {
  const { data: historico, isFetching, error } = db.Get<Lotofacil[]>(Route.api.lotofacil);
  const [linhaSelecionada, setLinhaSelecionada] = useState(0);

  const estatisticas = useMemo(
    () => lotofacil.calcularEstatisticasLinhas(historico ?? []),
    [historico]
  );

  if (isFetching) {
    return <LoadingData message="Carregando estatísticas por linha" />;
  }

  if (error) {
    return <ErrorWaring message={error.message} />;
  }

  if (!historico) return null;

  const numerosDaLinha = lotofacil.LINHAS[linhaSelecionada];
  const cartoes = numerosDaLinha
    .map((numero) => estatisticas.find((e) => e.numero === numero))
    .filter((e): e is EstatisticaNumeroLinha => e !== undefined);

  return (
    <div className="flex flex-col gap-3 w-full max-w-xl">
      <div className="flex flex-nowrap gap-1.5 sm:gap-2">
        {lotofacil.LINHAS.map((_, index) => (
          <button
            key={index}
            onClick={() => setLinhaSelecionada(index)}
            className={`flex-1 px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              linhaSelecionada === index
                ? "bg-[#7F3992] dark:bg-[#642D73] text-white"
                : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            <span className="sm:hidden">{index + 1}</span>
            <span className="hidden sm:inline">Linha {index + 1}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {cartoes.map((estatistica) => (
          <CartaoNumero key={estatistica.numero} estatistica={estatistica} />
        ))}
      </div>

      <Legenda />
    </div>
  );
}

function Legenda() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 px-1">
      {[...FAIXAS_PERCENTUAL].reverse().map((faixa) => (
        <span key={faixa.label} className="flex items-center gap-1.5">
          <span className={`inline-block w-3 h-3 rounded-sm ${faixa.cor}`} />
          {faixa.label}
        </span>
      ))}
    </div>
  );
}

function CartaoNumero({ estatistica }: { estatistica: EstatisticaNumeroLinha }) {
  const { numero, frequenciaAtual, atrasoAtual, sequenciaAtual, historicoRecente, percentual } = estatistica;

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg shadow-xs bg-white dark:bg-[#111827] p-3">
      <Numero number={numero} />

      <Estatistica label="Frequência atual" valor={frequenciaAtual} titulo="Vezes que saiu nos últimos 10 concursos" />
      <Estatistica label="Atraso atual" valor={atrasoAtual} />
      <Estatistica label="Sequência atual" valor={sequenciaAtual} apagado={sequenciaAtual === 0} />

      <div className="flex flex-col items-center gap-1.5">
        <div className="flex gap-1">
          {historicoRecente.map((saiu, index) => (
            <span
              key={index}
              className={`w-2.5 h-2.5 rounded-full ${saiu ? "bg-emerald-500" : "bg-red-500"}`}
              title={saiu ? "Saiu" : "Não saiu"}
            />
          ))}
        </div>
        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">HISTÓRICO</span>
      </div>

      <div className={`ml-auto px-3 py-1.5 rounded-md text-white text-sm font-bold ${corPercentual(percentual)}`}>
        {percentual}%
      </div>
    </div>
  );
}

function Estatistica({ label, valor, apagado = false, titulo }: { label: string; valor: number; apagado?: boolean; titulo?: string }) {
  return (
    <div className="flex flex-col items-center min-w-16" title={titulo}>
      <span className={`text-lg font-bold ${apagado ? "text-slate-400 dark:text-slate-600" : ""}`}>{valor}</span>
      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase text-center">{label}</span>
    </div>
  );
}
