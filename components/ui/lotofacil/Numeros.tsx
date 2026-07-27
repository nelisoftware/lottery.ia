import ErrorWaring from "@/components/misc/ErrorWarning";
import { db } from "@/libraries/db";
import { Icons } from "@/libraries/icons";
import { Route } from "@/libraries/routes";
import { Lotofacil, LotofacilNumeros } from "@prisma/client";
import { Card } from "../card";
import LoadingData from "@/components/misc/LoadingData";
import Numero from "./Numero";

export default function Numeros() {
  const { data, isFetching, error } = db.Get<LotofacilNumeros[]>(Route.api.lotofacilNumeros);
  const { data: last, error: errorLast } = db.Get<Lotofacil>(Route.api.lotofacilLast);

  if (isFetching) {
    return <LoadingData message="Números x que saiu...." />
  }

  if (error || errorLast) {
    return (
      <ErrorWaring>
        <div className="flex flex-col gap-2 items-center">
          <p>Erro ao buscar números saindo</p>
          <p className="text-red-800"> {error?.message}</p>
          <p className="text-red-800"> {errorLast?.message}</p>
        </div>
      </ErrorWaring>
    );
  }

  if (data === undefined || last === undefined) return;

  return (
    <Card.Root className="w-full text-sm">
      <Card.Title title="Número" icon={<Icons.tabler.Numbers />} />
      <div className="grid grid-cols-1 2xl:flex px-4 justify-between gap-2">
        <span className="grid grid-cols-3 2xl:grid-cols-1 gap-2 items-center- ">
          <p className="flex justify-start h-10 items-center ">Número</p>
          <p className="flex justify-center h-10 items-center">Saiu</p>
          <p className="flex justify-center h-10 items-center">%</p>
        </span>

        {data.map((numero, index) => (
          <span key={index} className="grid grid-cols-3 2xl:grid-cols-1 gap-2 h-10 ">
            <Numero number={numero.numero} />            
            <p className="flex h-10 justify-center items-center font-mono font-light">{numero.cont}</p>
            <p className="flex h-10 justify-center items-center font-extralight font-mono">{((numero.cont / last.numero) * 100).toPrecision(4)}</p>
          </span>
        ))}
      </div>
    </Card.Root>
  );
}