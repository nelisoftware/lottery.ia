'use client';
import ErrorWaring from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import LotofacilAnalysis from "@/components/ui/lotofacil/LotofacilAnalysis";
import NumberPicker from "@/components/ui/lotofacil/NumberPicker";
import ParametrosSelecao from "@/components/ui/lotofacil/ParametrosSelecao";
import { db } from "@/libraries/db";
import { lotofacil } from "@/libraries/lotofacil";
import { Route } from "@/libraries/routes";
import { Lotofacil } from "@prisma/client";
import { useCallback, useMemo, useState } from "react";

export default function CheckResultPage() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);     
  const [toAnalyze, setToAnalize] = useState<boolean>(false);
  const {
    data: lastResults,
    isFetching,
    error,
  } = db.Get<Lotofacil[]>(Route.api.lotofacil);

  const analyzeResults = useCallback(() => {    
    if (selectedNumbers.length < 15 || selectedNumbers.length > 20){
      alert('Selecione entre 15 e 20 números para análisee');
      return;
    }
    
    setToAnalize(true);
  },[selectedNumbers]);

  const toggleNumber = useCallback((number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else {
      if (selectedNumbers.length < 20) {
        setSelectedNumbers([...selectedNumbers, number].sort((a, b) => a - b));
      }
    }    
    setToAnalize(false);
  },[selectedNumbers]); 

  const clearSelection = useCallback(() => {
    setSelectedNumbers([]);
    setToAnalize(false);
  },[]);

  

  const content = useMemo(() => {
    if (isFetching) return <LoadingData message="Carregando dados para análise" />;
    if (error) return <ErrorWaring message={error.message} />;
    if (!lastResults) return;

    const index = lastResults.length-1;
    const latestNumbers = lastResults[index] ? lotofacil.extrairBolas(lastResults[index]) : [];

    return (
      <div className="bg-white dark:bg-[#111827] rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-slate-100">Selecione seus números</h2>
          <NumberPicker
            selectedNumbers={selectedNumbers}
            onToggle={toggleNumber}
            latestNumbers={latestNumbers}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
            <div className="flex flex-col gap-2">
              <p className="text-gray-700 dark:text-slate-300">Selecionados: {selectedNumbers.length}</p>
              {selectedNumbers.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-slate-400 wrap-break-word">
                  {selectedNumbers.join(', ')}
                </p>
              )}
              <div className="flex flex-col text-gray-700 dark:text-slate-300">
                <p className="wrap-break-word"><span className="text-amber-600 dark:text-amber-500">Pares ({lotofacil.contarPares(selectedNumbers)}):</span> {selectedNumbers.filter(number => number % 2 === 0).join(', ')}</p>
                <p className="wrap-break-word">Ímpares ({lotofacil.contarImpares(selectedNumbers)}): {selectedNumbers.filter(number => number % 2 != 0).join(', ')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearSelection}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Limpar
              </button>
              <button
                onClick={analyzeResults}
                disabled={selectedNumbers.length < 15 || selectedNumbers.length > 20}
                className={`px-4 py-2 rounded ${selectedNumbers.length >= 15 && selectedNumbers.length <= 20 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'}`}
              >
                Conferir
              </button>
            </div>
          </div>
        </div>
    );
    
  }, [error, isFetching, selectedNumbers,analyzeResults, clearSelection, lastResults, toggleNumber]);
  

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      <div className="flex flex-col gap-4">
        {content}
        <ParametrosSelecao selecionados={selectedNumbers} historico={lastResults} />
      </div>
      {toAnalyze && <LotofacilAnalysis cartao={selectedNumbers} results={lastResults} />}
    </div>
  );
}
