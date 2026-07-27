'use client';
import ErrorWaring from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import LotofacilAnalysis from "@/components/ui/lotofacil/LotofacilAnalysis";
import NumberPicker from "@/components/ui/lotofacil/NumberPicker";
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
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Selecione seus números</h2>
          <NumberPicker
            selectedNumbers={selectedNumbers}
            onToggle={toggleNumber}
            latestNumbers={latestNumbers}
          />

          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="text-gray-700">Selecionados: {selectedNumbers.length}</p>
              {selectedNumbers.length > 0 && (
                <p className="text-sm text-gray-600">                  
                  {selectedNumbers.join(', ')}
                </p>
              )}
              <div className="flex flex-col">
                <p><span className="text-amber-600">pares:</span>  {selectedNumbers.filter(number => number % 2 === 0).join(', ')}</p>
                <p>impares: {selectedNumbers.filter(number => number % 2 != 0).join(', ')}</p>
              </div>
            </div>
            <p className="text-gray-700">Pares: {lotofacil.contarPares(selectedNumbers)}</p>
            <p className="text-gray-700">Impares: {lotofacil.contarImpares(selectedNumbers)}</p>
            <div className="space-x-2">
              <button
                onClick={clearSelection}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Limpar
              </button>
              <button
                onClick={analyzeResults}
                disabled={selectedNumbers.length < 15 || selectedNumbers.length > 20}
                className={`px-4 py-2 rounded ${selectedNumbers.length >= 15 && selectedNumbers.length <= 20 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                Conferir
              </button>
            </div>
          </div>
        </div>      
    );
    
  }, [error, isFetching, selectedNumbers,analyzeResults, clearSelection, lastResults, toggleNumber]);
  

  return (
    <div className="grid grid-cols-2 gap-4 ">
      <div className="flex flex-col ">      
        {content}
      </div>      
      {toAnalyze && <LotofacilAnalysis cartao={selectedNumbers} results={lastResults} />}
        
    </div>
  );
}
