type TitleProps = {
  title: string;
  className?: string;
  icon?: React.ReactNode;
}
export default function Title({ title, className, icon }: TitleProps) {
  return (
    <header className={`flex items-center text-base font-bold p-2  ${className ?? ''}`}>
      {icon && <span className="pr-2">{icon}</span>}
      {title}
    </header>
  );
}