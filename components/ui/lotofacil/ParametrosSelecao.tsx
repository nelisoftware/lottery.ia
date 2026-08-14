'use client';
import { Icons } from "@/libraries/icons";
import { lotofacil } from "@/libraries/lotofacil";
import { Lotofacil } from "@prisma/client";
import { useMemo } from "react";
import { Card } from "../card";
import ParametrosTable from "./ParametrosTable";

type ParametrosSelecaoProps = {
  selecionados: number[];
  historico?: Lotofacil[];
};

/** Mesmos parâmetros do dashboard, calculados ao vivo para os números que o usuário vai selecionando. */
export default function ParametrosSelecao({ selecionados, historico }: ParametrosSelecaoProps) {
  const parametros = useMemo(() => {
    if (!historico || historico.length === 0 || selecionados.length === 0) return null;

    const estatisticas = lotofacil.calcularEstatisticas(historico);
    const ultimo = lotofacil.extrairBolas(historico[historico.length - 1]);

    return lotofacil.avaliarParametrosConcurso(selecionados, ultimo, estatisticas);
  }, [selecionados, historico]);

  if (!parametros) return null;

  return (
    <Card.Root className="w-full">
      <Card.Title title="Parâmetros da Seleção" icon={<Icons.tabler.ArtBoard />} />
      <Card.Content>
        <ParametrosTable parametros={parametros} />
      </Card.Content>
    </Card.Root>
  );
}
