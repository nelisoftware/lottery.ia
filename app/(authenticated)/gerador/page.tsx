'use client';
import CartaoLotofacil from "@/components/ui/lotofacil/CartaoLotofacil";
import ErrorWaring from "@/components/misc/ErrorWarning";
import LoadingData from "@/components/misc/LoadingData";
import NumberPicker from "@/components/ui/lotofacil/NumberPicker";
import { db } from "@/libraries/db";
import { CartaoGerado, EstatisticasHistoricas, FiltrosGerador, lotofacil, ResultadoFechamento } from "@/libraries/lotofacil";
import { Route } from "@/libraries/routes";
import { Lotofacil } from "@prisma/client";
import { useCallback, useMemo, useState } from "react";

export default function GeradorPage() {
  const { data: historico, isFetching, error } = db.Get<Lotofacil[]>(Route.api.lotofacil);

  const estatisticas: EstatisticasHistoricas | null = useMemo(() => {
    if (!historico) return null;
    return lotofacil.calcularEstatisticas(historico);
  }, [historico]);

  const ultimoConcurso: number[] | undefined = useMemo(() => {
    if (!historico || historico.length === 0) return undefined;
    return lotofacil.extrairBolas(historico[historico.length - 1]);
  }, [historico]);

  const [filtros, setFiltros] = useState<FiltrosGerador | null>(null);
  const [cartaoGerado, setCartaoGerado] = useState<CartaoGerado | null>(null);
  const [semResultado, setSemResultado] = useState(false);

  const filtrosAtivos: FiltrosGerador = useMemo(() => filtros ?? {
    quantidadeNumeros: 15,
    somaMin: estatisticas ? Math.round(estatisticas.somaMin) : 150,
    somaMax: estatisticas ? Math.round(estatisticas.somaMax) : 220,
    paresMin: estatisticas ? Math.floor(estatisticas.paresMin) : 6,
    paresMax: estatisticas ? Math.ceil(estatisticas.paresMax) : 9,
    maxConsecutivos: estatisticas ? Math.ceil(estatisticas.maxConsecutivosMax) : 6,
    repetidosAnteriorMin: estatisticas ? Math.floor(estatisticas.repetidosAnteriorMin) : 0,
    repetidosAnteriorMax: estatisticas ? Math.ceil(estatisticas.repetidosAnteriorMax) : 15,
    ultimoConcurso,
  }, [filtros, estatisticas, ultimoConcurso]);

  const atualizarFiltro = useCallback((campo: keyof FiltrosGerador, valor: number) => {
    setFiltros({ ...filtrosAtivos, [campo]: valor });
  }, [filtrosAtivos]);

  const gerar = useCallback(() => {
    const resultado = lotofacil.gerarCartao(filtrosAtivos);
    setCartaoGerado(resultado);
    setSemResultado(resultado === null);
  }, [filtrosAtivos]);

  const [poolFechamento, setPoolFechamento] = useState<number[]>([]);
  const [resultadoFechamento, setResultadoFechamento] = useState<ResultadoFechamento | null>(null);

  const toggleFechamento = useCallback((numero: number) => {
    setResultadoFechamento(null);
    setPoolFechamento(prev => prev.includes(numero) ? prev.filter(n => n !== numero) : [...prev, numero].sort((a, b) => a - b));
  }, []);

  const gerarFechamento = useCallback(() => {
    setResultadoFechamento(lotofacil.gerarFechamento(poolFechamento, 15));
  }, [poolFechamento]);

  return (
    <div className="p-4 flex flex-col gap-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-blue-800">Gerador de Jogos</h1>
      <p className="text-sm text-gray-600">
        Sorteios da Lotofácil são independentes — nada aqui prevê o próximo resultado. O gerador só evita
        combinações estatisticamente atípicas em relação ao histórico real (soma, paridade, sequências, repetição
        do concurso anterior), o que também tende a reduzir o risco de dividir prêmio com apostas muito parecidas
        com as de outras pessoas.
      </p>

      {isFetching && <LoadingData message="Carregando histórico para calibrar os filtros" />}
      {error && <ErrorWaring message={error.message} />}

      {estatisticas && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Filtros (calibrados pelo histórico real)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <label className="flex flex-col text-sm text-gray-700">
              Quantidade de números
              <select
                className="border rounded px-2 py-1 mt-1"
                value={filtrosAtivos.quantidadeNumeros}
                onChange={e => atualizarFiltro('quantidadeNumeros', +e.target.value)}
              >
                {Array.from({ length: 6 }, (_, i) => 15 + i).map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="flex flex-col text-sm text-gray-700">
              Soma mínima
              <input type="number" className="border rounded px-2 py-1 mt-1" value={filtrosAtivos.somaMin}
                onChange={e => atualizarFiltro('somaMin', +e.target.value)} />
            </label>
            <label className="flex flex-col text-sm text-gray-700">
              Soma máxima
              <input type="number" className="border rounded px-2 py-1 mt-1" value={filtrosAtivos.somaMax}
                onChange={e => atualizarFiltro('somaMax', +e.target.value)} />
            </label>
            <label className="flex flex-col text-sm text-gray-700">
              Pares (mínimo)
              <input type="number" className="border rounded px-2 py-1 mt-1" value={filtrosAtivos.paresMin}
                onChange={e => atualizarFiltro('paresMin', +e.target.value)} />
            </label>
            <label className="flex flex-col text-sm text-gray-700">
              Pares (máximo)
              <input type="number" className="border rounded px-2 py-1 mt-1" value={filtrosAtivos.paresMax}
                onChange={e => atualizarFiltro('paresMax', +e.target.value)} />
            </label>
            <label className="flex flex-col text-sm text-gray-700">
              Máx. números consecutivos
              <input type="number" className="border rounded px-2 py-1 mt-1" value={filtrosAtivos.maxConsecutivos}
                onChange={e => atualizarFiltro('maxConsecutivos', +e.target.value)} />
            </label>
            <label className="flex flex-col text-sm text-gray-700">
              Repetidos do concurso anterior (mínimo)
              <input type="number" className="border rounded px-2 py-1 mt-1" value={filtrosAtivos.repetidosAnteriorMin}
                disabled={!ultimoConcurso} onChange={e => atualizarFiltro('repetidosAnteriorMin', +e.target.value)} />
            </label>
            <label className="flex flex-col text-sm text-gray-700">
              Repetidos do concurso anterior (máximo)
              <input type="number" className="border rounded px-2 py-1 mt-1" value={filtrosAtivos.repetidosAnteriorMax}
                disabled={!ultimoConcurso} onChange={e => atualizarFiltro('repetidosAnteriorMax', +e.target.value)} />
            </label>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Histórico: soma variou entre {Math.round(estatisticas.somaMin)} e {Math.round(estatisticas.somaMax)}
            {" "}(média {estatisticas.somaMedia.toFixed(1)}); pares entre {estatisticas.paresMin} e {estatisticas.paresMax};
            {" "}maior sequência de consecutivos já vista: {estatisticas.maxConsecutivosMax}; números repetidos em
            {" "}relação ao concurso anterior variaram entre {estatisticas.repetidosAnteriorMin} e {estatisticas.repetidosAnteriorMax}
            {" "}(média {estatisticas.repetidosAnteriorMedia.toFixed(1)} de {filtrosAtivos.quantidadeNumeros}).
            {!ultimoConcurso && " (carregando último concurso para calibrar esse filtro...)"}
          </p>
          <button onClick={gerar} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Gerar cartão
          </button>

          {semResultado && (
            <p className="text-red-600 mt-4">
              Não encontrei nenhuma combinação dentro desses filtros em 2000 tentativas — tente afrouxar a soma ou os pares.
            </p>
          )}

          {cartaoGerado && (
            <div className="mt-4">
              <CartaoLotofacil cartao15={cartaoGerado.numeros} />
              <p className="text-sm text-gray-600 mt-2">
                Soma: {cartaoGerado.soma} · Pares: {cartaoGerado.pares} · Ímpares: {cartaoGerado.impares} ·
                {" "}Maior sequência: {cartaoGerado.maxConsecutivos}
                {cartaoGerado.repetidosAnterior !== null && <> · Repetidos do concurso anterior: {cartaoGerado.repetidosAnterior}</>}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">Fechamento</h2>
        <p className="text-sm text-gray-600 mb-4">
          Escolha um pool de números (mínimo 15). Até 20 números geramos todas as combinações possíveis
          (garantia matemática formal); acima disso usamos uma heurística de cobertura de pares, sem garantia formal.
        </p>
        <NumberPicker selectedNumbers={poolFechamento} onToggle={toggleFechamento} />
        <p className="text-sm text-gray-700 mb-4">Selecionados: {poolFechamento.length}</p>
        <button
          onClick={gerarFechamento}
          disabled={poolFechamento.length < 15}
          className={`px-4 py-2 rounded ${poolFechamento.length >= 15 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Gerar fechamento
        </button>

        {resultadoFechamento && (
          <div className="mt-4">
            <p className={`font-medium mb-3 ${resultadoFechamento.garantiaFormal ? 'text-green-700' : 'text-amber-700'}`}>
              {resultadoFechamento.garantiaFormal
                ? `Cobertura exaustiva: ${resultadoFechamento.cartelas.length} cartelas com garantia matemática formal.`
                : `Cobertura heurística (sem garantia formal): ${resultadoFechamento.cartelas.length} cartelas.`}
            </p>
            <div className="flex flex-col gap-3 max-h-128 overflow-y-auto">
              {resultadoFechamento.cartelas.map((cartela, index) => (
                <div key={index} className="border rounded p-2">
                  <p className="text-xs text-gray-500 mb-1">Cartela {index + 1}</p>
                  <CartaoLotofacil cartao15={cartela} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
