import ErrorWaring from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import { db } from "@/libraries/db";
import { Icons } from "@/libraries/icons";
import { Route } from "@/libraries/routes";
import { LotofacilNumeroSaindo } from "@prisma/client";
import { Card } from "../card";
import Numero from "./Numero";


export default function Atrasado() {
  const { data, isFetching, error } = db.Get<LotofacilNumeroSaindo[]>(Route.api.lotofacilNumerosNaoSaindo);

  if (isFetching) {
    return <LoadingData message="Números atrasados" />
  }

  if (error) {
    return (
      <ErrorWaring>
        <div className="flex flex-col gap-2 items-center">
          <p>Erro ao buscar números atrasados</p>
          <p className="text-red-800"> {error?.message}</p>
        </div>
      </ErrorWaring>
    );
  }

  if (data === undefined) return; 

  const grouping: {
    amount: number,
    numbers: number[]
  }[] = [];

  data.forEach((value) => {
    const group = grouping.find((g) => g.amount === value.cont);

    if (group === undefined) {
      grouping.push({
        amount: value.cont,
        numbers: [value.numero],
      });
    }
    else {
      group.numbers.push(value.numero);
    }
  });

  return (
    <Card.Root className="w-full sm:w-72">
      <Card.Title title="Atrasados" icon={<Icons.tabler.ClockPause />} />
      <Card.Content>
        <div>
          {grouping?.map((value, index) => (
            <div key={index} className="grid grid-cols-1 justify-between pb-4">
              <div className="font-semibold  w-full">{value.amount} <span className="font-light"> vezes</span></div>
              <div className="flex flex-wrap gap-1">{value.numbers?.map((number, index) => <Numero number={number} key={index}/>)}</div>
            </div>
          )) ?? ''}
        </div>        
      </Card.Content>
    </Card.Root>
  );
}