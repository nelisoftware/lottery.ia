import { ParametroConcurso } from "@/libraries/lotofacil";

type ParametrosTableProps = {
  parametros: ParametroConcurso[];
};

export default function ParametrosTable({ parametros }: ParametrosTableProps) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500 dark:text-gray-400">
          <th className="py-1 font-normal">Parametro</th>
          <th className="py-1 font-normal">Qtd</th>
          <th className="py-1 font-normal">Status</th>
        </tr>
      </thead>
      <tbody>
        {parametros.map((parametro) => (
          <tr key={parametro.nome} className="border-t border-gray-100 dark:border-gray-800">
            <td className="py-2">{parametro.nome}</td>
            <td className="py-2">{parametro.valor}</td>
            <td className="py-2">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium text-white ${parametro.status === 'padrao' ? 'bg-green-600' : 'bg-red-600'
                  }`}
              >
                {parametro.status === 'padrao' ? 'Padrão' : 'Fora do padrão'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
