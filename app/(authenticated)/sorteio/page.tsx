'use client';
import { Card } from "@/components/ui/card";
import CartaoLotofacil from "@/components/ui/lotofacil/CartaoLotofacil";
import NumberPicker from "@/components/ui/lotofacil/NumberPicker";
import { Icons } from "@/libraries/icons";
import { lotofacil, ResultadoSorteioAleatorio } from "@/libraries/lotofacil";
import { useCallback, useState } from "react";

export default function SorteioPage() {
  const [pool, setPool] = useState<number[]>([]);
  const [tamanhoCartela, setTamanhoCartela] = useState(15);
  const [quantidade, setQuantidade] = useState(10);
  const [resultado, setResultado] = useState<ResultadoSorteioAleatorio | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [copiadoIndex, setCopiadoIndex] = useState<number | null>(null);

  const togglePool = useCallback((numero: number) => {
    setResultado(null);
    setPool(prev => prev.includes(numero) ? prev.filter(n => n !== numero) : [...prev, numero].sort((a, b) => a - b));
  }, []);

  const gerar = useCallback(() => {
    try {
      setErro(null);
      setResultado(lotofacil.gerarSorteioAleatorio(pool, tamanhoCartela, quantidade));
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao gerar');
      setResultado(null);
    }
  }, [pool, tamanhoCartela, quantidade]);

  const formatarCartela = (cartela: number[], index: number) => {
    const linhas: string[] = [];
    for (let i = 0; i < cartela.length; i += 5) {
      linhas.push(cartela.slice(i, i + 5).map(n => String(n).padStart(2, '0')).join(' '));
    }
    return [`Cartão ${index + 1}`, linhas.join('\n')].join('\n');
  };

  const copiarTudo = async () => {
    if (!resultado) return;
    await navigator.clipboard.writeText(resultado.cartelas.map(formatarCartela).join('\n\n'));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const copiarCartela = async (cartela: number[], index: number) => {
    await navigator.clipboard.writeText(formatarCartela(cartela, index));
    setCopiadoIndex(index);
    setTimeout(() => setCopiadoIndex(atual => atual === index ? null : atual), 2000);
  };

  return (
    <div className="p-4 flex flex-col gap-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-blue-800">Sorteio Aleatório</h1>
      <p className="text-sm text-gray-600">
        Escolha um pool de números, o tamanho do cartão e quantos cartões quer gerar. Sorteamos cartões aleatórios
        únicos usando somente os números do pool, sem repetir nenhum número dentro de um cartão nem gerar cartões
        repetidos. Diferente do Fechamento, aqui não há garantia de cobertura de todas as combinações — é uma
        amostragem aleatória do tamanho pedido.
      </p>

      <div className="bg-white dark:bg-[#111827] rounded-lg shadow-xs p-6">
        <h2 className="text-xl font-semibold mb-4">Configuração</h2>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          Números do pool ({pool.length} selecionados)
        </p>
        <NumberPicker selectedNumbers={pool} onToggle={togglePool} />

        <div className="flex flex-nowrap gap-4 mb-4">
          <label className="flex flex-col text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Tamanho do cartão
            <select
              className="border rounded px-2 py-1 mt-1"
              value={tamanhoCartela}
              onChange={e => { setResultado(null); setTamanhoCartela(+e.target.value); }}
            >
              {Array.from({ length: 6 }, (_, i) => 15 + i).map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label className="flex flex-col text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Qtd cartões
            <input
              type="number"
              min={1}
              className="border rounded px-2 py-1 mt-1 w-32"
              value={quantidade}
              onChange={e => { setResultado(null); setQuantidade(Math.max(1, +e.target.value)); }}
            />
          </label>
        </div>

        <button
          onClick={gerar}
          disabled={pool.length < tamanhoCartela}
          className={`px-4 py-2 rounded ${pool.length >= tamanhoCartela ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Gerar cartões
        </button>

        {erro && <p className="text-red-600 mt-4">{erro}</p>}
      </div>

      {resultado && (
        <Card.Root className="w-full">
          <Card.Title
            title={`${resultado.cartelas.length} cartão(ões) gerado(s)`}
            icon={<Icons.tabler.Shuffle />}
            action={
              <button
                type="button"
                onClick={copiarTudo}
                title="Copiar todos os cartões"
                className="p-1 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {copiado ? <Icons.tabler.Check size={18} className="text-green-600 dark:text-green-500" /> : <Icons.tabler.Copy size={18} />}
              </button>
            }
          />
          <Card.Content>
            {resultado.cartelas.length < resultado.solicitado && (
              <p className="text-amber-700 text-sm mb-3">
                Não foi possível gerar {resultado.solicitado} cartões únicos com esse pool — geramos os {resultado.cartelas.length} possíveis.
              </p>
            )}
            <div className="flex flex-col gap-3 max-h-128 overflow-y-auto">
              {resultado.cartelas.map((cartela, index) => (
                <div key={index} className="border rounded p-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-500">Cartão {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => copiarCartela(cartela, index)}
                      title={`Copiar cartão ${index + 1}`}
                      className="p-1 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {copiadoIndex === index ? <Icons.tabler.Check size={16} className="text-green-600 dark:text-green-500" /> : <Icons.tabler.Copy size={16} />}
                    </button>
                  </div>
                  <CartaoLotofacil cartao15={cartela} />
                </div>
              ))}
            </div>
          </Card.Content>
        </Card.Root>
      )}
    </div>
  );
}
