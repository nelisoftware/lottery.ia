import { Lotofacil } from "@prisma/client";
import { lotofacil, HistoricalAnalysisItem } from "@/libraries/lotofacil";
import { useEffect, useState } from "react";

type LotofacilAnalysisProps = {
  cartao: number[];
  results: Lotofacil[] | undefined;
};

interface AnalysisResult {
  hitsInLatest: number;
  latestConcurso: number;
  historicalAnalysis: HistoricalAnalysisItem[];
  selectedNumbersCount: number;
}

export default function LotofacilAnalysis({
  cartao: selectedNumbers,
  results: lastResults,
}: LotofacilAnalysisProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() =>{
    if (!lastResults) return ;

    if (selectedNumbers.length < 15 || selectedNumbers.length > 20){
      alert('Selecione entre 15 e 20 números para análisee');
      return ;
    }
    const latestResult = lastResults[lastResults.length-1];
    const latestNumbers: number[] = lotofacil.extrairBolas(latestResult);

    const hitsInLatest: number = lotofacil.calcularAcertos(selectedNumbers, latestNumbers);

    const historicalAnalysis: HistoricalAnalysisItem[] = lotofacil.conferirHistorico(
      selectedNumbers,
      lastResults
    );

    setAnalysis({
      hitsInLatest,
      latestConcurso: latestResult.numero,
      historicalAnalysis,
      selectedNumbersCount: selectedNumbers.length,
    });
  },[lastResults, selectedNumbers]);

  if (!lastResults) return;

  if (!analysis) return <div>sem análise</div>;

  return (
    <div className="bg-white dark:bg-[#111827] rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-slate-100">Resultado da Análise</h2>

      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
          Último Concurso ({analysis.latestConcurso}):
        </h3>
        <p className="text-lg text-gray-900 dark:text-slate-100">
          Você acertou{" "}
          <span className="font-bold">{analysis.hitsInLatest}</span> números
        </p>
        {analysis.hitsInLatest >= 11 && (
          <p className="text-green-600 dark:text-green-400 font-medium mt-2">
            Parabéns! Você teria acertado {analysis.hitsInLatest} números e
            ganho na faixa de prêmio.
          </p>
        )}
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-700 dark:text-slate-300 mb-2">Resumo de acertos:</h4>
        <div className="flex flex-wrap gap-2">
          {([
            { hits: 11, bg: 'bg-red-100 dark:bg-red-950' },
            { hits: 12, bg: 'bg-orange-100 dark:bg-orange-950' },
            { hits: 13, bg: 'bg-yellow-100 dark:bg-yellow-950' },
            { hits: 14, bg: 'bg-blue-100 dark:bg-blue-950' },
            { hits: 15, bg: 'bg-green-100 dark:bg-green-950' },
          ] as const).map(({ hits, bg }) => (
            <div key={hits} className={`flex-1 min-w-20 ${bg} text-gray-900 dark:text-slate-100 p-2 rounded text-center`}>
              <p className="font-bold text-lg">{hits}</p>
              <p className="text-xs whitespace-nowrap">acertos</p>
              <p className="text-sm">
                {analysis.historicalAnalysis.filter((a) => a.hits === hits).length}x
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700 dark:text-slate-300 mb-2">
          Detalhes por concurso:
        </h4>

        {/* Mobile: um card por concurso, sem scroll horizontal */}
        <div className="lg:hidden flex flex-col gap-2">
          {analysis.historicalAnalysis
            .map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-slate-100">Concurso {item.concurso}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 dark:text-slate-100">{item.hits} acertos</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {item.prizeLevel ? `Faixa ${item.prizeLevel}` : "-"}
                  </p>
                </div>
              </div>
            )).reverse().slice(0, 50)}
        </div>

        {/* Desktop: tabela completa */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-[#111827] text-gray-900 dark:text-slate-200 border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="py-2 px-4 border border-gray-200 dark:border-gray-700">Concurso</th>
                <th className="py-2 px-4 border border-gray-200 dark:border-gray-700">Data</th>
                <th className="py-2 px-4 border border-gray-200 dark:border-gray-700">Acertos</th>
                <th className="py-2 px-4 border border-gray-200 dark:border-gray-700">Prêmio</th>
              </tr>
            </thead>
            <tbody>
              {analysis.historicalAnalysis
                .map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : ""}>
                    <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-center">
                      {item.concurso}
                    </td>
                    <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-center">{item.date}</td>
                    <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-center">{item.hits}</td>
                    <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-center">
                      {item.prizeLevel ? `Faixa ${item.prizeLevel}` : "-"}
                    </td>
                  </tr>
                )).reverse().slice(0, 50)}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
          Mostrando os 50 concursos mais recentes de{" "}
          {analysis.historicalAnalysis.length} no total
        </p>
      </div>
    </div>
  );
}
