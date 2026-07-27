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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Resultado da Análise</h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">
          Último Concurso ({analysis.latestConcurso}):
        </h3>
        <p className="text-lg">
          Você acertou{" "}
          <span className="font-bold">{analysis.hitsInLatest}</span> números
        </p>
        {analysis.hitsInLatest >= 11 && (
          <p className="text-green-600 font-medium mt-2">
            Parabéns! Você teria acertado {analysis.hitsInLatest} números e
            ganho na faixa de prêmio.
          </p>
        )}
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Resumo de acertos:</h4>
        <div className="grid grid-cols-5 gap-2">
          <div className="bg-red-100 p-2 rounded text-center">
            <p className="font-bold">11 acertos</p>
            <p>
              {analysis.historicalAnalysis.filter((a) => a.hits === 11).length}x
            </p>
          </div>
          <div className="bg-orange-100 p-2 rounded text-center">
            <p className="font-bold">12 acertos</p>
            <p>
              {analysis.historicalAnalysis.filter((a) => a.hits === 12).length}x
            </p>
          </div>

          <div className="bg-yellow-100 p-2 rounded text-center">
            <p className="font-bold">13 acertos</p>
            <p>
              {analysis.historicalAnalysis.filter((a) => a.hits === 13).length}x
            </p>
          </div>

          <div className="bg-blue-100 p-2 rounded text-center">
            <p className="font-bold">14 acertos</p>
            <p>
              {analysis.historicalAnalysis.filter((a) => a.hits === 14).length}x
            </p>
          </div>

          <div className="bg-green-100 p-2 rounded text-center">
            <p className="font-bold">15 acertos</p>
            <p>
              {analysis.historicalAnalysis.filter((a) => a.hits === 15).length}x
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <h4 className="font-medium text-gray-700 mb-2">
          Detalhes por concurso:
        </h4>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Concurso</th>
              <th className="py-2 px-4 border">Data</th>
              <th className="py-2 px-4 border">Acertos</th>
              <th className="py-2 px-4 border">Prêmio</th>
            </tr>
          </thead>
          <tbody>            
            {analysis.historicalAnalysis                                          
              .map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="py-2 px-4 border text-center">
                    {item.concurso}
                  </td>
                  <td className="py-2 px-4 border text-center">{item.date}</td>
                  <td className="py-2 px-4 border text-center">{item.hits}</td>
                  <td className="py-2 px-4 border text-center">
                    {item.prizeLevel ? `Faixa ${item.prizeLevel}` : "-"}
                  </td>
                </tr>
              )).reverse().slice(0,50)}
          </tbody>
        </table>
        <p className="text-sm text-gray-500 mt-2">
          Mostrando os 50 concursos mais recentes de{" "}
          {analysis.historicalAnalysis.length} no total
        </p>
      </div>
    </div>
  );
}
