type TitleProps = {
  title: string;
  className?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}
export default function Title({ title, className, icon, action }: TitleProps) {
  return (
    <header className={`flex items-center justify-between text-base font-bold p-2  ${className ?? ''}`}>
      <span className="flex items-center">
        {icon && <span className="pr-2">{icon}</span>}
        {title}
      </span>
      {action}
    </header>
  );
}