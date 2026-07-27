import Image from "next/image";

type NotFoundProps = {
  error?: string;
}

export default function NotFound(
  {
    error = 'Informação não encontrada no sistema!!!'
  }: NotFoundProps) {
  return (
    <div className="flex items-center text-center pt-9">
        <div className="h-10 w-10">
          <Image
            src="/notFound.svg"
            alt="Não encontrado /Not found"
            height={100}
            width={100}
          />
        </div>
        <div className="text-gray-600 dark:text-gray-400 font-semibold text-xl border-r-2 border-slate-500 pl-2">
          <p> {error} </p>
        </div>
      </div>
  );
}