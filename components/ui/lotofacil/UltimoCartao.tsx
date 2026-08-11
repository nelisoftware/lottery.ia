import ErrorWaring from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import { db } from "@/libraries/db";
import { Icons } from "@/libraries/icons";
import { Route } from "@/libraries/routes";
import { DateTime } from "luxon";
import { Card } from "../card";
import CartaoLofacil from "./CartaoLotofacil";
import { Lotofacil } from "@prisma/client";

export default function UltimoCartao() {
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

  return (
    <Card.Root className="w-full sm:w-72">
      <Card.Title title={`Concurso ${data.numero} `} icon={<Icons.tabler.ArtBoard />} />
      <Card.Content>
        <CartaoLofacil cartao15={[
          data?.bola01,
          data?.bola02,
          data?.bola03,
          data?.bola04,
          data?.bola05,
          data?.bola06,
          data?.bola07,
          data?.bola08,
          data?.bola09,
          data?.bola10,
          data?.bola11,
          data?.bola12,
          data?.bola13,
          data?.bola14,
          data?.bola15
        ]} />
      </Card.Content>
      <Card.Footer>
        <p> Data:
          <span className="text-purple-950 dark:text-gray-500 font-light pl-2">
            {DateTime.fromJSDate(new Date(data.dataApuracao), { zone: 'utc' }).toFormat('dd/MM/yyyy')}
          </span>
        </p>
      </Card.Footer>
    </Card.Root>

  );
}