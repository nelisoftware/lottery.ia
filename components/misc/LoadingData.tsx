import React from 'react';
import Spinkit from './Spinkit';

type LoadingDataProps = {
  message?: string;
  onlyAnimation?:boolean;
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
};


export default function LoadingData({ message, onlyAnimation, type = 'wave'} : LoadingDataProps) {
  if (onlyAnimation) {
    return (
      <>
        <Spinkit
            type={type}
            color="var(--color-blue-400)"
            dots={type === 'fold' ? 4 : 5}
          />
      </>
    );
  }
  return (
    <>
      <div>
        <div className="flex flex-col items-center my-2">
          <Spinkit
            type={type}
            color="var(--color-blue-400)"
            dots={5}
          />
          <div className="pt-4 text-slate-500 text-sm font-semibold">
            {message ?? ''}
          </div>
        </div>
      </div>
    </>
  );
}