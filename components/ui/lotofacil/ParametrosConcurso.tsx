'use client';
import ErrorWaring from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import { db } from "@/libraries/db";
import { Icons } from "@/libraries/icons";
import { lotofacil, ParametroConcurso } from "@/libraries/lotofacil";
import { Route } from "@/libraries/routes";
import { Lotofacil } from "@prisma/client";
import { useMemo } from "react";
import { Card } from "../card";
import ParametrosTable from "./ParametrosTable";

export default function ParametrosConcurso() {
  const { data: historico, isFetching, error } = db.Get<Lotofacil[]>(Route.api.lotofacil);

  const parametros: ParametroConcurso[] | null = useMemo(() => {
    if (!historico || historico.length === 0) return null;

    const estatisticas = lotofacil.calcularEstatisticas(historico);
    const ultimo = historico[historico.length - 1];
    const anterior = historico.length > 1 ? historico[historico.length - 2] : null;

    return lotofacil.avaliarParametrosConcurso(
      lotofacil.extrairBolas(ultimo),
      anterior ? lotofacil.extrairBolas(anterior) : null,
      estatisticas
    );
  }, [historico]);

  if (isFetching) {
    return <LoadingData message="Carregando parâmetros do concurso" />
  }

  if (error) {
    return (
      <ErrorWaring>
        <div className="flex flex-col gap-2 items-center">
          <p>Erro ao buscar parâmetros do concurso</p>
          <p className="text-red-800"> {error?.message}</p>
        </div>
      </ErrorWaring>
    );
  }

  if (!parametros) return <>sem dados</>;

  return (
    <Card.Root className="w-full sm:w-80">
      <Card.Title title="Parâmetros do Concurso" icon={<Icons.tabler.ArtBoard />} />
      <Card.Content>
        <ParametrosTable parametros={parametros} />
      </Card.Content>
    </Card.Root>
  );
}
