'use client';
import ErrorWaring from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import { db } from "@/libraries/db";
import { EstatisticaParesImpares, lotofacil } from "@/libraries/lotofacil";
import { Icons } from "@/libraries/icons";
import { Route } from "@/libraries/routes";
import { Lotofacil } from "@prisma/client";
import { useMemo } from "react";
import { Card } from "../card";

const TOP_N = 5;

export default function ParesImpares() {
  const { data, isFetching, error } = db.Get<Lotofacil[]>(Route.api.lotofacil);

  const estatisticas = useMemo(
    () => lotofacil.calcularEstatisticasParesImpares(data ?? []),
    [data]
  );

  if (isFetching) {
    return <LoadingData message="Carregando os concursos da Lotofacil" />;
  }

  if (error) {
    return <ErrorWaring message={error.message} />;
  }

  if (!data) return null;

  const melhores = ordenarPor(estatisticas, TOP_N, "desc");
  const piores = ordenarPor(estatisticas, TOP_N, "asc");

  return (
    <div className="flex flex-col gap-4">
      <TabelaParesImpares titulo="5 Melhores Combinações" icon={<Icons.tabler.Scale />} itens={melhores} />
      <TabelaParesImpares titulo="5 Piores Combinações" icon={<Icons.tabler.Scale />} itens={piores} />
    </div>
  );
}

function ordenarPor(
  itens: EstatisticaParesImpares[],
  limite: number,
  direcao: "asc" | "desc"
): EstatisticaParesImpares[] {
  return [...itens]
    .sort((a, b) => direcao === "desc" ? b.ocorrencias - a.ocorrencias : a.ocorrencias - b.ocorrencias)
    .slice(0, limite);
}

type TabelaParesImparesProps = {
  titulo: string;
  icon: React.ReactNode;
  itens: EstatisticaParesImpares[];
};

function TabelaParesImpares({ titulo, icon, itens }: TabelaParesImparesProps) {
  return (
    <Card.Root className="w-full">
      <Card.Title title={titulo} icon={icon} />
      <Card.Content>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400">
                <th className="py-1 font-normal">Qtd Pares</th>
                <th className="py-1 font-normal">Qtd Ímpares</th>
                <th className="py-1 font-normal">Ocorrências</th>
                <th className="py-1 font-normal">Atraso atual</th>
                <th className="py-1 font-normal">Porcentagem</th>
                <th className="py-1 font-normal">Média de ocorrência</th>
                <th className="py-1 font-normal">Última ocorrência</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => (
                <tr key={item.qtdPares} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-2">{item.qtdPares}</td>
                  <td className="py-2">{item.qtdImpares}</td>
                  <td className="py-2 font-semibold">{item.ocorrencias}</td>
                  <td className="py-2">{item.atrasoAtual}</td>
                  <td className="py-2">{item.percentual.toFixed(2)}%</td>
                  <td className="py-2">
                    {item.mediaOcorrencia === 0 ? "—" : `1 em ${item.mediaOcorrencia} concursos`}
                  </td>
                  <td className="py-2">{item.ultimaOcorrencia ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card.Content>
    </Card.Root>
  );
}
