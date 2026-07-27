import { Route } from "@/libraries/routes";
import Link from "next/link";

type ErrorWaringProps = {
  message?: string;
  children?: React.ReactNode;
}

export default function ErrorWaring({ message, children}: ErrorWaringProps) {

  return (
    <div>
      <div className="fixed inset-0 z-10 bg-black bg-opacity-25 text-gray-700" >
        <div className="flex h-full w-full items-center justify-center">
          <div className={`absolute z-50 mx-5 my-0 flex h-auto max-w-5xl flex-col overflow-hidden -rounded-xl bg-white shadow-2xl`}>
            <div className="flex bg-red-500 w-auto h-52 items-center justify-center">
              <p className="flex items-center justify-center bg-white text-red-500 text-7xl w-24 h-24 rounded-full font-extrabold">!</p>
            </div>
            <div className={`flex flex-1 items-center justify-center p-3 `}>
              {children}
              {message}
            </div>
            <footer className={`flex w-full gap-2 p-3 bg-opacity-50 justify-center`}>

              <Link
                href={{
                  pathname: Route.link.home ,
                  query: "",
                }}
                className={`text-sm rounded-sm outline-hidden focus:outline-hidden focus:underline transition-all duration-300 hover:scale-105  ease-linear  px-3 py-2 bg-cyan-600 dark:bg-cyan-900 hover:bg-cyan-900 dark:hover:bg-cyan-600 text-slate-200`}
              >
                Inicio
              </Link>

            </footer>
          </div>
        </div>
      </div>
    </div>
  );

}