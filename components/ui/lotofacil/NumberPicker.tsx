'use client';

type NumberPickerProps = {
  selectedNumbers: number[];
  onToggle: (number: number) => void;
  latestNumbers?: number[];
};

export default function NumberPicker({
  selectedNumbers,
  onToggle,
  latestNumbers = [],
}: NumberPickerProps) {
  const getButtonClass = (number: number): string => {
    const base = 'w-full aspect-square rounded-md flex items-center justify-center text-base sm:text-lg font-bold ';
    const selected = selectedNumbers.includes(number);
    const drawn = latestNumbers.includes(number);

    if (selected && drawn) return base + 'bg-[#4b085e] text-white'; // selecionado e saiu no último concurso
    if (selected) return base + 'bg-[#7F3992] text-white'; // selecionado mas não saiu
    if (drawn) return base + 'bg-gray-400 dark:bg-gray-600 text-gray-800 dark:text-gray-200'; // não selecionado mas saiu no último concurso
    return base + 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700';
  };

  return (
    <div className="grid grid-cols-5 gap-2 mb-6 max-w-xs">
      {Array.from({ length: 25 }, (_, i) => i + 1).map((number) => (
        <button
          key={number}
          onClick={() => onToggle(number)}
          className={getButtonClass(number)}
        >
          {number}
        </button>
      ))}
    </div>
  );
}
