'use client';
import ErrorWaring from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import { db } from "@/libraries/db";
import { Icons } from "@/libraries/icons";
import { Route } from "@/libraries/routes";
import { Lotofacil } from "@prisma/client";
import { DateTime } from "luxon";
import { useState } from "react";
import { Card } from "../card";
import GradeNumeros from "./GradeNumeros";

export default function ResultadoConcurso() {
  const { data, isFetching, error } = db.Get<Lotofacil>(Route.api.lotofacilLast);
  const [copiado, setCopiado] = useState(false);

  if (isFetching) {
    return <LoadingData message="Carregando o último concurso" />
  }

  if (error) {
    return (
      <ErrorWaring>
        <div className="flex flex-col gap-2 items-center">
          <p>Erro ao buscar o último concurso</p>
          <p className="text-red-800"> {error?.message}</p>
        </div>
      </ErrorWaring>
    );
  }

  if (data === undefined || !data.bola01) return <>sem dados</>;

  const sorteados = [
    data.bola01, data.bola02, data.bola03, data.bola04, data.bola05,
    data.bola06, data.bola07, data.bola08, data.bola09, data.bola10,
    data.bola11, data.bola12, data.bola13, data.bola14, data.bola15,
  ];

  const copiarNumeros = async () => {
    const linhas: string[] = [];
    for (let i = 0; i < sorteados.length; i += 5) {
      linhas.push(sorteados.slice(i, i + 5).map((n) => String(n).padStart(2, '0')).join(' '));
    }
    await navigator.clipboard.writeText(linhas.join('\n'));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <Card.Root className="w-full sm:w-72">
      <Card.Title
        title={`Resultado da Lotofácil ${data.numero}`}
        icon={<Icons.tabler.ArtBoard />}
        action={
          <button
            type="button"
            onClick={copiarNumeros}
            title="Copiar números"
            className="p-1 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {copiado ? <Icons.tabler.Check size={18} className="text-green-600 dark:text-green-500" /> : <Icons.tabler.Copy size={18} />}
          </button>
        }
      />
      <Card.Content>
        <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2 mb-3">
          Data do Sorteio: {DateTime.fromJSDate(new Date(data.dataApuracao), { zone: 'utc' }).toFormat('dd/MM/yyyy')}
        </p>
        <GradeNumeros sorteados={sorteados} />
      </Card.Content>
    </Card.Root>
  );
}
