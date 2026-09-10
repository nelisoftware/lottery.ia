'use client';
import { Card } from "@/components/ui/card";
import CartaoLotofacil from "@/components/ui/lotofacil/CartaoLotofacil";
import NumberPicker from "@/components/ui/lotofacil/NumberPicker";
import { Icons } from "@/libraries/icons";
import { lotofacil, ResultadoEscalonamento } from "@/libraries/lotofacil";
import { useCallback, useState } from "react";

export default function EscalonamentoPage() {
  const [fixos, setFixos] = useState<number[]>([]);
  const [tamanhoCartela, setTamanhoCartela] = useState(15);
  const [cartoesPorIntervalo, setCartoesPorIntervalo] = useState(5);
  const [resultado, setResultado] = useState<ResultadoEscalonamento | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const toggleFixo = useCallback((numero: number) => {
    setResultado(null);
    setFixos(prev => {
      if (prev.includes(numero)) return prev.filter(n => n !== numero);
      if (prev.length >= 3) return prev;
      return [...prev, numero].sort((a, b) => a - b);
    });
  }, []);

  const gerar = useCallback(() => {
    try {
      setErro(null);
      setResultado(lotofacil.gerarEscalonamento(fixos, tamanhoCartela, cartoesPorIntervalo));
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao gerar');
      setResultado(null);
    }
  }, [fixos, tamanhoCartela, cartoesPorIntervalo]);

  const copiarTudo = async () => {
    if (!resultado) return;
    const blocos = resultado.intervalos.map(intervalo => {
      const titulo = `Intervalo ${String(intervalo.escalonados[0]).padStart(2, '0')}-${String(intervalo.escalonados[1]).padStart(2, '0')}`;
      const cartelas = intervalo.cartelas.map(cartela => {
        const linhas: string[] = [];
        for (let i = 0; i < cartela.length; i += 5) {
          linhas.push(cartela.slice(i, i + 5).map(n => String(n).padStart(2, '0')).join(' '));
        }
        return linhas.join('\n');
      });
      return [titulo, ...cartelas].join('\n\n');
    });
    await navigator.clipboard.writeText(blocos.join('\n\n'));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const totalCartoes = resultado ? resultado.intervalos.reduce((acc, i) => acc + i.cartelas.length, 0) : 0;

  return (
    <div className="p-4 flex flex-col gap-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-blue-800">Cartões Escalonados</h1>
      <p className="text-sm text-gray-600">
        Escolha 3 números fixos que nunca entram no jogo. Um par de números vai escalonando (deslizando de 1 em 1,
        com sobreposição) pelos outros 22 números até cobrir todos. Em cada posição, os 5 números excluídos (3 fixos
        + 2 escalonados) deixam um pool de 20 números, do qual sorteamos os cartões daquele intervalo.
      </p>

      <div className="bg-white dark:bg-[#111827] rounded-lg shadow-xs p-6">
        <h2 className="text-xl font-semibold mb-4">Configuração</h2>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          Números fixos ({fixos.length}/3)
        </p>
        <NumberPicker selectedNumbers={fixos} onToggle={toggleFixo} />

        <div className="grid grid-cols-2 gap-4 mb-4 max-w-xs">
          <label className="flex flex-col text-sm text-gray-700 dark:text-gray-300">
            Números por cartão
            <select
              className="border rounded px-2 py-1 mt-1"
              value={tamanhoCartela}
              onChange={e => { setResultado(null); setTamanhoCartela(+e.target.value); }}
            >
              {Array.from({ length: 6 }, (_, i) => 15 + i).map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label className="flex flex-col text-sm text-gray-700 dark:text-gray-300">
            Cartões por intervalo
            <input
              type="number"
              min={1}
              className="border rounded px-2 py-1 mt-1"
              value={cartoesPorIntervalo}
              onChange={e => { setResultado(null); setCartoesPorIntervalo(Math.max(1, +e.target.value)); }}
            />
          </label>
        </div>

        <button
          onClick={gerar}
          disabled={fixos.length !== 3}
          className={`px-4 py-2 rounded ${fixos.length === 3 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Gerar cartões
        </button>

        {erro && <p className="text-red-600 mt-4">{erro}</p>}
      </div>

      {resultado && (
        <Card.Root className="w-full">
          <Card.Title
            title={`${resultado.intervalos.length} intervalos · ${totalCartoes} cartões gerados`}
            icon={<Icons.tabler.Stairs />}
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
            <div className="flex flex-col gap-4 max-h-128 overflow-y-auto">
              {resultado.intervalos.map((intervalo, index) => (
                <div key={index} className="border rounded p-2">
                  <p className="text-xs text-gray-500 mb-2">
                    Intervalo {String(intervalo.escalonados[0]).padStart(2, '0')}-{String(intervalo.escalonados[1]).padStart(2, '0')}
                    {' '}· {intervalo.cartelas.length} cartão(ões)
                  </p>
                  <div className="flex flex-col gap-2">
                    {intervalo.cartelas.map((cartela, cIndex) => (
                      <div key={cIndex} className="border rounded p-2">
                        <p className="text-xs text-gray-500 mb-1">Cartão {cIndex + 1}</p>
                        <CartaoLotofacil cartao15={cartela} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card.Root>
      )}
    </div>
  );
}
