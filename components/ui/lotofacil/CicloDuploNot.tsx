'use client';
import ErrorWaring from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import { db } from "@/libraries/db";
import { Icons } from "@/libraries/icons";
import { Route } from "@/libraries/routes";
import { LotofacilCicloDuplo, LotofacilCicloDuploNaoSaindo } from "@prisma/client";
import { Card } from "../card";
import Numero from "./Numero";


export default function CicloDuploNot() {
  const { data, isFetching, error } = db.Get<LotofacilCicloDuploNaoSaindo[]>(Route.api.lotofacilCicloDuploNo);

  if (isFetching) return <LoadingData message="Carregando ciclo duplo não saindo" />;
  if (error) return <ErrorWaring message={error.message} />;
  if (data === undefined) return;

  const last = data[0];
  const amountOfCycles = data.filter(value => value.completo);
  const str = last.numeros.split(';');
  const htmlNumbers: React.JSX.Element[] = [];


  str.forEach(value => {
    if (value != '') {
      const tempStr = value.split('-');

      htmlNumbers.push(
        <div className="flex gap-2 justify-center" key={htmlNumbers.length}>
          {tempStr.map((value, index) => <Numero key={index} number={+value} />)}
        </div>
      );

    }
  });

  let cont = 0;
  for (let a of data) {
    if (a.completo) break;
    cont++;
  }

  return (
    <Card.Root className="w-full sm:w-96">
      <Card.Title title={`Ciclo Duplo - Não Saindo`} icon={<Icons.tabler.Cycle />} />
      <Card.Content>
        <p className="mb-3">Ciclo: <span className="font-semibold">{cont}</span> de <span className="font-bold">{(data.length / amountOfCycles.length).toFixed(2)}</span>(média)</p>
        <div className="grid grid-cols-2 gap-2 ">
          {htmlNumbers}
        </div>
      </Card.Content>

    </Card.Root>
  );
}