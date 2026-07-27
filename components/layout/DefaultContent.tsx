type DefaultContentProps = {
  title?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;  
}
export default function DefaultContent( { title, icon, children} : DefaultContentProps) {
  return (
    <>
      <div className='p-2 w-auto '>
        {title &&
          <div className='flex mb-7 items-end h-10 rounded-xs shadow-sm~ gap-1 ml-2'>
            {icon}
            <span className=" font-medium text-xl md:text-xl -mb-1">{title}</span>
          </div>
        }
        <div className='text-slate-700 dark:text-slate-400 '>
          {children}
        </div>
      </div>
    </>
  );
}