import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type DefaultItemMenuProps = {
  href: string;
  slug?: string;
  nameLink: string;
  icon?: React.ReactNode;
}

export default function DefaultItemMenu({ href, slug, nameLink, icon }: DefaultItemMenuProps) {
  const [linkFont, setLinkFont] = React.useState<string>('');
  const [linkIcon, setLinkIcon] = React.useState<string>('');

  const pathLink = usePathname();

  React.useMemo(() => {
    if (pathLink.toString() === href) {
      setLinkFont('text-purple-800 dark:text-slate-50');
      setLinkIcon('text-purple-950 dark:text-slate-50')
    } else {
      setLinkFont('text-slate-600 dark:text-slate-400');
      setLinkIcon('text-slate-600')
    }
  }, [pathLink, href]);

  return (
    <>
      <Link
        href={{
          pathname: href,
          query: slug,
        }}
        className="flex rounded-xs h-8 duration-300 pl-4 mr-2 hover:text-slate-950 hover:bg-hoverColor  dark:hover:bg-slate-700"
      >
        <div className="flex items-center gap-2">
          <span className={`h-6 ${linkIcon}`}>{icon}</span>
          <span className={`${linkFont} text-sm h-6 mt-1`}>{nameLink}</span>
        </div>
      </Link>
    </>
  );

} 