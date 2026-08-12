'use client';
import ErrorWaring from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import { db } from "@/libraries/db";
import { Icons } from "@/libraries/icons";
import { Route } from "@/libraries/routes";
import { Lotofacil } from "@prisma/client";
import { DateTime } from "luxon";
import { Card } from "../card";

export default function ResultadoConcurso() {
  const { data, isFetching, error } = db.Get<Lotofacil>(Route.api.lotofacilLast);

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

  const sorteados = new Set([
    data.bola01, data.bola02, data.bola03, data.bola04, data.bola05,
    data.bola06, data.bola07, data.bola08, data.bola09, data.bola10,
    data.bola11, data.bola12, data.bola13, data.bola14, data.bola15,
  ]);

  return (
    <Card.Root className="w-full sm:w-72">
      <Card.Title title={`Resultado da Lotofácil ${data.numero}`} icon={<Icons.tabler.ArtBoard />} />
      <Card.Content>
        <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2 mb-3">
          Data do Sorteio: {DateTime.fromJSDate(new Date(data.dataApuracao), { zone: 'utc' }).toFormat('dd/MM/yyyy')}
        </p>
        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: 25 }, (_, i) => i + 1).map((numero) => {
            const saiu = sorteados.has(numero);
            return (
              <div
                key={numero}
                className={`flex aspect-square w-full rounded-md justify-center items-center font-semibold ${saiu
                    ? 'bg-[#7F3992] dark:bg-[#642D73] text-white'
                    : 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                  }`}
              >
                {numero < 10 ? '0' + numero : numero}
              </div>
            );
          })}
        </div>
      </Card.Content>
    </Card.Root>
  );
}
