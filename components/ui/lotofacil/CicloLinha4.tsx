'use client';
import ErrorWaring from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import { db } from "@/libraries/db";
import { Icons } from "@/libraries/icons";
import { Route } from "@/libraries/routes";
import { LotofacilCiclo } from "@prisma/client";
import { Card } from "../card";
import Numero from "./Numero";
import { useMemo } from "react";

export default function CicloLinha4() {
  const { data: cycles, isFetching, error } = db.Get<LotofacilCiclo[]>(Route.api.lotofacilCicloLinha4);

  const content = useMemo(() => {
    if (isFetching) return <LoadingData message="Carregando ciclo da linha 4" />;
    if (error) return <ErrorWaring message={error.message} />;
    if (!cycles) return;

    const last = cycles[0];
    const completedCycles = cycles.filter(cycle => cycle.completo);
    const missingNumbers: number[] = last.numeros.split(';').filter(value => value !== '').map(value => +value);

    let cycleCount = 0;

    for (let cycle of cycles) {
      if (cycle.completo) break;
      cycleCount++;
    }
    return (
      <Card.Root className="w-full sm:w-96">
        <Card.Title title={`Ciclo Linha 4 `} icon={<Icons.tabler.Cycle />} />
        <Card.Content>
          <p className="mb-3">Ciclo: <span className="font-semibold">{cycleCount}</span> de <span className="font-bold">{(cycles.length / completedCycles.length).toFixed(2)}</span>(média)</p>
          <div className="grid grid-cols-5 gap-2">
            {missingNumbers.map((value, index) => <Numero number={value}  key={index} />)}
          </div>
        </Card.Content>
      </Card.Root>
    );
  },[cycles, error, isFetching]);
  return <>{content}</>
}
