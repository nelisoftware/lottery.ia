'use client';
import ErrorWaring from "@/components/misc/ErrorWarning";
import LoadingDataModal from "@/components/misc/LoadingDataModal";
import { db } from "@/libraries/db";
import { Route } from "@/libraries/routes";
import { LotofacilCaixa } from "@/types/types";

export default function UpdatePage() {
  const { data, error, isFetching } = db.Get<LotofacilCaixa>(Route.api.lotofacilUpdate)

  if (isFetching) {
    return <LoadingDataModal message="Atualizando os concursos da Lotofácil" />
  }

  if (error) {
    return (
      <ErrorWaring>Erro ao atentar atualizar o sistema</ErrorWaring>
    );
  }
  return (
    <>
      Sistema atualizado
    </>
  );
}