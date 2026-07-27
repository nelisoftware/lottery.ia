'use client';
import ErrorWaring from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import LotofacilAnalysis from "@/components/ui/lotofacil/LotofacilAnalysis";
import NumberPicker from "@/components/ui/lotofacil/NumberPicker";
import { db } from "@/libraries/db";
import { lotofacil } from "@/libraries/lotofacil";
import { Route } from "@/libraries/routes";
import { Lotofacil } from "@prisma/client";
import { useCallback, useState } from "react";

export default function CartaoPage() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [toAnalyze, setToAnalyze] = useState<boolean>(false);
  const {
    data: lastResults,
    isFetching,
    error,
  } = db.Get<Lotofacil[]>(Route.api.lotofacil);

  const toggleNumber = useCallback((number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else if (selectedNumbers.length < 20) {
      setSelectedNumbers([...selectedNumbers, number].sort((a, b) => a - b));
    }
    setToAnalyze(false);
  }, [selectedNumbers]);

  const analyzeResults = useCallback(() => {
    if (selectedNumbers.length < 15 || selectedNumbers.length > 20) {
      alert('Selecione entre 15 e 20 números para análise');
      return;
    }
    setToAnalyze(true);
  }, [selectedNumbers]);

  const clearSelection = useCallback(() => {
    setSelectedNumbers([]);
    setToAnalyze(false);
  }, []);

  const latestNumbers = lastResults && lastResults.length > 0
    ? lotofacil.extrairBolas(lastResults[lastResults.length - 1])
    : [];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">Lotofácil - Conferência</h1>

        {isFetching && <LoadingData message="Carregando dados para análise" />}
        {error && <ErrorWaring message={error.message} />}

        {!isFetching && !error && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Selecione seus números (15-20)</h2>
            <NumberPicker
              selectedNumbers={selectedNumbers}
              onToggle={toggleNumber}
              latestNumbers={latestNumbers}
            />

            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700">Selecionados: {selectedNumbers.length}</p>
                {selectedNumbers.length > 0 && (
                  <p className="text-sm text-gray-600">
                    {selectedNumbers.join(', ')}
                  </p>
                )}
              </div>
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
        )}

        {toAnalyze && <LotofacilAnalysis cartao={selectedNumbers} results={lastResults} />}
      </div>
    </div>
  );
}
