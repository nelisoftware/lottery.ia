'use client';
import ErrorWaring from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import { db } from "@/libraries/db";
import { Icons } from "@/libraries/icons";
import { Route } from "@/libraries/routes";
import { LotofacilCicloTriplo } from "@prisma/client";
import { Card } from "../card";
import Numero from "./Numero";
import React, { useMemo } from "react";

export default function CicloTriplo() {
  const { data: cycles, isFetching, error } = db.Get<LotofacilCicloTriplo[]>(Route.api.lotofacilCicloTriplo);

  const result = useMemo(() => {
    if (isFetching) return <LoadingData message="Carregando ciclo triplo" />;
    if (error) return <ErrorWaring message={error.message} />;
    if (!cycles) return;

    const lastCycle = cycles[0];
    const completedCycles = cycles.filter(cycle => cycle.completo);

    let cycleCount = 0;
    for (let cycle of cycles) {
      if (cycle.completo) break;
      cycleCount++;
    }

    const htmlNumbers: React.JSX.Element[] = [];
    lastCycle.numeros.split(';').forEach(value => {
      if (value !== '') {
        const tempStr = value.split('-');
        const numerosComponents = tempStr.map((number, index) => <Numero key={index} number={+number} />)

        htmlNumbers.push(
          <div className="flex gap-2 justify-center" key={htmlNumbers.length}>
            {numerosComponents}
          </div>
        );
      }
    });

    return (
      <Card.Root className="w-full sm:w-96">
        <Card.Title title={`Ciclo Triplo`} icon={<Icons.tabler.Cycle />} />
        <Card.Content>
          <p className="mb-3">Ciclo: <span className="font-semibold">{cycleCount}</span> de <span className="font-bold">{(cycles.length / completedCycles.length).toFixed(2)}</span>(média)</p>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 ">
            {htmlNumbers}
          </div>
        </Card.Content>
      </Card.Root>
    );

  }, [cycles, error, isFetching]);

  return <>{result}</>
}