'use client';
import { Icons } from "@/libraries/icons";
import React from "react";

type DefaultSubMenuProps = {
  nameLink: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
export default function DefaultSubMenu({ nameLink, icon, children }: DefaultSubMenuProps) {
  const [visibleSub, setVisibleSub] = React.useState(false);

  const itemSub = React.useMemo(() => {
    if (visibleSub) {
      return (
        <>
          <div className="flex">
            <div className="w-6" />
            <div className="w-full">{children}</div>
          </div>
        </>
      );
    }

    return <></>;
  }, [children, visibleSub]);

  return (
    <>
      <button
        onClick={() => setVisibleSub(!visibleSub)}
        className="w-full h-areaLogo rounded-md duration-300 hover:bg-hoverColor  dark:hover:bg-slate-700"
      >
        <div className="flex h-areaLogo items-center justify-between ">
          <div className="flex items-center justify-start">
            <span className="ml-4 h-6 text-slate-500 mr-1">{icon}</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {nameLink}
            </span>
          </div>
          {visibleSub ? (
            <Icons.tabler.CaretUp className="text-slate-600 dark:text-textDark mr-3" />            
            
          ) : (
            <Icons.tabler.CaretDown className="text-slate-600 dark:text-textDark mr-3" />            
          )}
        </div>
      </button>
      {itemSub}
    </>
  );
}