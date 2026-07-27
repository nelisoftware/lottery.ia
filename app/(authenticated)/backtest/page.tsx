'use client';
import ErrorWaring from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import NumberPicker from "@/components/ui/lotofacil/NumberPicker";
import { db } from "@/libraries/db";
import { lotofacil, MetodoDinamico, ResultadoBacktest } from "@/libraries/lotofacil";
import { Route } from "@/libraries/routes";
import { Lotofacil } from "@prisma/client";
import { useCallback, useMemo, useState } from "react";

type Modo = 'fixa' | 'dinamico';

export default function BacktestPage() {
  const { data: historicoOriginal, isFetching, error } = db.Get<Lotofacil[]>(Route.api.lotofacil);

  const historico = useMemo(() => {
    if (!historicoOriginal) return undefined;
    return [...historicoOriginal].sort((a, b) => a.numero - b.numero);
  }, [historicoOriginal]);

  const [modo, setModo] = useState<Modo>('fixa');
  const [cartela, setCartela] = useState<number[]>([]);
  const [metodo, setMetodo] = useState<MetodoDinamico>('mais-frequentes');
  const [janelaMinima, setJanelaMinima] = useState<number>(50);
  const [resultado, setResultado] = useState<ResultadoBacktest | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const toggleNumero = useCallback((numero: number) => {
    setResultado(null);
    setCartela(prev => prev.includes(numero) ? prev.filter(n => n !== numero) : (prev.length < 20 ? [...prev, numero].sort((a, b) => a - b) : prev));
  }, []);

  const rodar = useCallback(() => {
    if (!historico) return;
    setAviso(null);

    if (modo === 'fixa') {
      if (cartela.length < 15 || cartela.length > 20) {
        setAviso('Selecione entre 15 e 20 números para a cartela fixa.');
        return;
      }
      setResultado(lotofacil.backtestCartela(cartela, historico));
    } else {
      if (historico.length <= janelaMinima) {
        setAviso('A janela de aquecimento é maior que o histórico disponível.');
        return;
      }
      setResultado(lotofacil.backtestMetodoDinamico(metodo, historico, 15, janelaMinima));
    }
  }, [historico, modo, cartela, metodo, janelaMinima]);

  return (
    <div className="p-4 flex flex-col gap-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-blue-800">Backtest</h1>
      <p className="text-sm text-gray-600">
        Confere, com números reais do histórico, quantas vezes uma cartela (ou um método) teria dado 11-15 pontos.
        Para métodos dinâmicos, cada decisão usa só os concursos <strong>anteriores</strong> ao avaliado — nunca
        estatísticas que só existiam depois do sorteio, senão o resultado ficaria artificialmente inflado.
      </p>

      {isFetching && <LoadingData message="Carregando histórico" />}
      {error && <ErrorWaring message={error.message} />}

      {historico && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => { setModo('fixa'); setResultado(null); }}
              className={`px-4 py-2 rounded ${modo === 'fixa' ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
            >
              Cartela fixa
            </button>
            <button
              onClick={() => { setModo('dinamico'); setResultado(null); }}
              className={`px-4 py-2 rounded ${modo === 'dinamico' ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
            >
              Método dinâmico
            </button>
          </div>

          {modo === 'fixa' && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Selecione 15-20 números</h2>
              <NumberPicker selectedNumbers={cartela} onToggle={toggleNumero} />
              <p className="text-sm text-gray-700">Selecionados: {cartela.length}</p>
            </div>
          )}

          {modo === 'dinamico' && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label className="flex flex-col text-sm text-gray-700">
                Método
                <select className="border rounded px-2 py-1 mt-1" value={metodo} onChange={e => setMetodo(e.target.value as MetodoDinamico)}>
                  <option value="mais-frequentes">15 números mais frequentes até o momento</option>
                  <option value="menos-frequentes">15 números menos frequentes até o momento</option>
                </select>
              </label>
              <label className="flex flex-col text-sm text-gray-700">
                Janela de aquecimento (concursos)
                <input type="number" min={1} className="border rounded px-2 py-1 mt-1" value={janelaMinima}
                  onChange={e => setJanelaMinima(Math.max(1, +e.target.value))} />
              </label>
            </div>
          )}

          <button onClick={rodar} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Rodar backtest
          </button>

          {aviso && <p className="text-red-600 mt-4">{aviso}</p>}

          {resultado && (
            <div className="mt-6">
              <div className="mb-4 p-4 bg-blue-50 rounded-lg grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <p>Concursos avaliados: <strong>{resultado.resumo.totalConcursos}</strong></p>
                <p>Custo total estimado: <strong>{resultado.resumo.custoTotalEstimado !== null ? `R$ ${resultado.resumo.custoTotalEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'não disponível'}</strong></p>
                <p>Retorno estimado (11-13): <strong>R$ {resultado.resumo.retornoEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></p>
              </div>
              {resultado.resumo.concursosSemEstimativaDeRetorno > 0 && (
                <p className="text-xs text-amber-700 mb-4">
                  {resultado.resumo.concursosSemEstimativaDeRetorno} concurso(s) bateram 14 ou 15 pontos — prêmio
                  variável (depende do rateio), por isso não entra no retorno estimado acima.
                </p>
              )}

              <div className="grid grid-cols-5 gap-2 mb-4">
                {([11, 12, 13, 14, 15] as const).map(faixa => (
                  <div key={faixa} className="bg-gray-100 p-2 rounded text-center">
                    <p className="font-bold">{faixa} acertos</p>
                    <p>{resultado.resumo.porFaixa[faixa]}x</p>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto">
                <h4 className="font-medium text-gray-700 mb-2">Detalhes por concurso (últimos 50):</h4>
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
                    {[...resultado.detalhes].reverse().slice(0, 50).map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="py-2 px-4 border text-center">{item.concurso}</td>
                        <td className="py-2 px-4 border text-center">{item.date}</td>
                        <td className="py-2 px-4 border text-center">{item.hits}</td>
                        <td className="py-2 px-4 border text-center">{item.prizeLevel ? `Faixa ${item.prizeLevel}` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
