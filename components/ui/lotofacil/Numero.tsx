type NumeroProps = {
  number: number;
  marcado?: boolean;
}
export default function Numero({ number, marcado =  true }: NumeroProps) {
  return (
    <div className={`flex ${marcado ? 'bg-[#7F3992] dark:bg-[#642D73]' : 'bg-gray-400 dark:bg-gray-600' }  w-10 h-10 rounded-md justify-center items-center `}>
      <span className="text-white dark:text-purple-100 font-semibold">
        {number < 10 ? '0' + number : number}
      </span>
    </div>
  );
}