"use client";
import ErrorWarning from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import { db } from "@/libraries/db";
import { lotofacil, SequenciaNumero } from "@/libraries/lotofacil";
import { Route } from "@/libraries/routes";
import { Lotofacil } from "@prisma/client";
import { useMemo } from "react";

const CLASS_SAINDO = "bg-[#2a78d6] dark:bg-[#3987e5]";
const CLASS_AUSENTE = "bg-[#eb6834] dark:bg-[#d95926]";
const CLASS_TRACK = "bg-slate-300 dark:bg-slate-600";

type SequenciasNumerosProps = {
  className?: string;
};

export default function SequenciasNumeros({
  className = "w-full",
}: SequenciasNumerosProps) {
  const { data, isFetching, error } = db.Get<Lotofacil[]>(Route.api.lotofacil);

  const sequencias = useMemo(
    () => lotofacil.calcularSequenciasPorNumero(data ?? []),
    [data]
  );

  if (isFetching)
    return <LoadingData message="Carregando os concursos da Lotofacil" />;
  if (error) return <ErrorWarning message={error.message} />;
  if (!data) return null;

  const maxAusenciaGlobal = Math.max(1, ...sequencias.map((s) => s.maxAusencia));
  const maxSequenciaGlobal = Math.max(1, ...sequencias.map((s) => s.maxSequencia));

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Legenda />
      <div className="flex flex-col rounded-lg shadow p-3 gap-1">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 px-1 pb-1">
          <div className="w-10 shrink-0 text-right">Atual/Máx.</div>
          <div className="flex-1 text-right pr-1">Ausência</div>
          <div className="w-9 shrink-0 text-center">Nº</div>
          <div className="flex-1 text-left pl-1">Sequência</div>
          <div className="w-10 shrink-0 text-left">Atual/Máx.</div>
        </div>
        {sequencias.map((sequencia) => (
          <LinhaSequencia
            key={sequencia.numero}
            sequencia={sequencia}
            maxAusenciaGlobal={maxAusenciaGlobal}
            maxSequenciaGlobal={maxSequenciaGlobal}
          />
        ))}
      </div>
    </div>
  );
}

function Legenda() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 px-1">
      <span className="flex items-center gap-1.5">
        <span className={`inline-block w-3 h-3 rounded-sm ${CLASS_SAINDO}`} />
        Em sequência (saindo)
      </span>
      <span className="flex items-center gap-1.5">
        <span className={`inline-block w-3 h-3 rounded-sm ${CLASS_AUSENTE}`} />
        Em ausência
      </span>
      <span className="flex items-center gap-1.5">
        <span className={`inline-block w-3 h-3 rounded-sm ${CLASS_TRACK}`} />
        Recorde histórico
      </span>
    </div>
  );
}

type LinhaSequenciaProps = {
  sequencia: SequenciaNumero;
  maxAusenciaGlobal: number;
  maxSequenciaGlobal: number;
};

function LinhaSequencia({
  sequencia,
  maxAusenciaGlobal,
  maxSequenciaGlobal,
}: LinhaSequenciaProps) {
  const { numero, maxSequencia, maxAusencia, atual, status } = sequencia;

  const trackAusenciaPct = (maxAusencia / maxAusenciaGlobal) * 100;
  const trackSequenciaPct = (maxSequencia / maxSequenciaGlobal) * 100;
  const fillAusenciaPct = status === "ausente" ? (atual / maxAusenciaGlobal) * 100 : 0;
  const fillSequenciaPct = status === "saindo" ? (atual / maxSequenciaGlobal) * 100 : 0;

  const title =
    status === "saindo"
      ? `Número ${numero}: saindo há ${atual} concurso(s) seguido(s). Recorde de sequência: ${maxSequencia}. Recorde de ausência: ${maxAusencia}.`
      : `Número ${numero}: ausente há ${atual} concurso(s) seguido(s). Recorde de ausência: ${maxAusencia}. Recorde de sequência: ${maxSequencia}.`;

  return (
    <div
      className="flex items-center gap-2 h-7 hover:bg-sky-100 dark:hover:bg-sky-900/40 rounded"
      title={title}
    >
      <div className="w-10 shrink-0 text-right text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
        {status === "ausente" ? `${atual}/${maxAusencia}` : `0/${maxAusencia}`}
      </div>

      <div className="relative flex-1 h-6">
        <div
          className={`absolute right-0 top-0 h-6 ${CLASS_TRACK}`}
          style={{ width: `${trackAusenciaPct}%`, borderRadius: "4px 0 0 4px" }}
        />
        {fillAusenciaPct > 0 && (
          <div
            className={`absolute right-0 top-0 h-6 ${CLASS_AUSENTE}`}
            style={{ width: `${fillAusenciaPct}%`, borderRadius: "4px 0 0 4px" }}
          />
        )}
      </div>

      <div
        className={`w-7 h-6 shrink-0 rounded-xl flex items-center justify-center text-white text-xs font-semibold ${
          status === "saindo" ? CLASS_SAINDO : CLASS_AUSENTE
        }`}
      >
        {numero < 10 ? "0" + numero : numero}
      </div>

      <div className="relative flex-1 h-6">
        <div
          className={`absolute left-0 top-0 h-6 ${CLASS_TRACK}`}
          style={{ width: `${trackSequenciaPct}%`, borderRadius: "0 4px 4px 0" }}
        />
        {fillSequenciaPct > 0 && (
          <div
            className={`absolute left-0 top-0 h-6 ${CLASS_SAINDO}`}
            style={{ width: `${fillSequenciaPct}%`, borderRadius: "0 4px 4px 0" }}
          />
        )}
      </div>

      <div className="w-10 shrink-0 text-left text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
        {status === "saindo" ? `${atual}/${maxSequencia}` : `0/${maxSequencia}`}
      </div>
    </div>
  );
}
