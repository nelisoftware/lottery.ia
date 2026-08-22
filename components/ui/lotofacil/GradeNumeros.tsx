type GradeNumerosProps = {
  sorteados: number[] | Set<number>;
  destacarFalta?: number[] | Set<number>; // números ausentes a marcar em vermelho
  className?: string;
};

/** Grade 1-25 (5x5) com destaque quadrado nos números sorteados. */
export default function GradeNumeros({ sorteados, destacarFalta, className = '' }: GradeNumerosProps) {
  const set = sorteados instanceof Set ? sorteados : new Set(sorteados);
  const faltaSet = destacarFalta instanceof Set ? destacarFalta : new Set(destacarFalta ?? []);

  return (
    <div className={`grid grid-cols-5 gap-1.5 ${className}`}>
      {Array.from({ length: 25 }, (_, i) => i + 1).map((numero) => {
        const saiu = set.has(numero);
        const emFalta = !saiu && faltaSet.has(numero);
        return (
          <div
            key={numero}
            className={`flex aspect-square w-full rounded-md justify-center items-center font-semibold ${saiu
                ? 'bg-[#7F3992] dark:bg-[#642D73] text-white'
                : emFalta
                  ? 'bg-red-500 dark:bg-red-700 text-white'
                  : 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
              }`}
          >
            {numero < 10 ? '0' + numero : numero}
          </div>
        );
      })}
    </div>
  );
}
