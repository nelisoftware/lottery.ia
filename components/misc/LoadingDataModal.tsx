import { Route } from "@/libraries/routes";
import Link from "next/link";
import Spinkit from "./Spinkit";

type LoadingDataModalProps = {
  message?: string;
  children?: React.ReactNode;
  type?:
    | 'plane'
    | 'chase'
    | 'bounce'
    | 'wave'
    | 'pulse'
    | 'flow'
    | 'swing'
    | 'circle'
    | 'circle-fade'
    | 'grid'
    | 'fold'
    | 'wander';
}

export default function LoadingDataModal({ message = '', type = 'wave', children }: LoadingDataModalProps) {

  return (
    <div>
      <div className="fixed inset-0 z-10 bg-black bg-opacity-25 text-gray-700" >
        <div className="flex h-full w-full items-center justify-center rounded-">
          <div className={`absolute z-50 mx-5 my-0 flex h-auto max-w-5xl flex-col overflow-hidden -rounded-xl bg-white shadow-2xl rounded-md`}>
            <div className="flex bg-blue-900 min-w-32 h-28 items-center justify-center">
              <Spinkit
                type={type}
                color="var(--color-blue-200)"
                dots={5}
              />
            </div>
            <div className={`flex flex-1 items-center justify-center -p-3 ${message === '' ? '' : 'p-3'} `}>
              {message}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}