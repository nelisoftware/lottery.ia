import { formatter } from "@/libraries/formatters";

type ListProps = {
  list: string[];
  listString?: string;
  className?: string;
}
export default function List({ list = [], className = '' }: ListProps) {
  return (
    <div className={`flex flex-col w-full bg-white dark:bg-[#111827]  ${className}`}>
      <p className="line-clamp-8 truncate max-w-xs text-sm">
          {list.map((value, index) => <span key={index}>{formatter.Name(value)}<br/></span>)}
      </p>
    </div>
  );
}