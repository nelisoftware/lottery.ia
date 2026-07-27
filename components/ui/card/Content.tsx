type ContentProps = {
  children: React.ReactNode;
  className?: string;
}
export default function Content({ children, className = '' }: ContentProps) {
  return (
    <div className={`px-2 pb-2 ${className}`}>
      {children}
    </div>
  );

}