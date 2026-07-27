type RootProps = {
  children: React.ReactNode;
  className?: string;
}
export default function Root({ children, className = '' }: RootProps) {
  if (!className.includes('w-')) {
    className += 'w-auto';
  }
  return (
    <div className={`bg-white dark:bg-[#111827]  rounded-lg shadow-xs ${className}`}>
      {children}
    </div>
  );

}