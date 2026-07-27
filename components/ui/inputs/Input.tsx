import { check } from '@/libraries/checks';
import { formatter } from '@/libraries/formatters';
import { Icons } from '@/libraries/icons';
import React from 'react';
import { maskControle } from './mask';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right';
  mask?: 'cep' | 'cpf' | 'onlyNumber' | 'phone';
  background?: string;
}

export default function Input({ mask, icon, iconPosition = 'left', autoComplete = 'off', readOnly, className = 'w-full', id, background = 'bg-gray-200 dark:bg-gray-800', ...inputProps }: InputProps) {
  const [cpfStatus, setCpfStatus] = React.useState<String>('');

  const handleKeyUp = React.useCallback((e: React.FormEvent<HTMLInputElement>) => {
    if (!mask) return;

    if (mask === 'cpf') {
      const cpf = e.currentTarget.value;
      if (formatter.OnlyNumbers(cpf).length === 11) {        
        if (check.cpf(cpf)) {
          setCpfStatus('check');          
        } else {
          setCpfStatus('fail');          
        }
      } else {
        setCpfStatus('');
      }
    }

    return maskControle(e, mask);
  }, [mask]);

  const icone = React.useMemo(() => {
    if (cpfStatus === 'check') {      
      return <Icons.tabler.Check  color='#08843d' />
    } else if (cpfStatus === 'fail') {
      return <Icons.tabler.AlertTriangle stroke={1} color='rgb(227 0 28)' />
    }

    return <div />;
  }, [cpfStatus]);


  let inputPosition = 'px-2';
  let labelPosition = 'peer-placeholder-shown:left-1';

  if (icon) {
    if (iconPosition === 'left') {
      inputPosition = 'pl-8 pr-2';
      labelPosition = 'peer-placeholder-shown:left-7';

    } else {
      inputPosition = 'px-2 pr-8';
    }
  }

  let withCSS = '';
  if (className) {
    className
      .split(" ")
      .map(word => {
        if (word.includes('w-')) {
          withCSS += ' ' + word;
        }
      })
  }

  const cssReadOnly = readOnly ? 'bg-gray-400 dark:bg-gray-700 focus:border-slate-400 dark:focus:border-slate-600 peer-focus:text-slate-600 dark:peer-focus:text-slate-300' : ''
  if (!className?.includes('w-')) {
    className += 'w-full';
  }

  return (
    <div className={`relative ${withCSS} `}>
      {(icon && iconPosition === 'left') && <span className="flex absolute left-1 top-2.5 h-2">{icon}</span>}
      <input
        {...inputProps}
        id={id}
        readOnly={readOnly}
        onChange={mask ? handleKeyUp : inputProps.onChange}
        autoComplete={autoComplete}
        className={`
          peer 
          ${background} pt-2 pb-2 rounded-md 
          text-base text-slate-700 dark:text-slate-400
          placeholder:text-sm placeholder-transparent
          border border-slate-400 dark:border-slate-600 
          focus:outline-hidden focus:border-sky-500 dark:focus:border-sky-800
          ${cssReadOnly} ${inputPosition} ${className}          
        `}
      />
      <label
        htmlFor={id}
        className={`
          absolute transition-all ${background} rounded
          text-sm text-slate-600 dark:text-slate-300
          left-1 -top-2.5 px-1          
          peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 
          dark:peer-focus:sky-800 peer-focus:text-sky-500
          peer-focus:-top-2.5 peer-focus:left-1
          ${labelPosition} ${cssReadOnly}
        `}
      >
        {inputProps.placeholder}
      </label>
      {(icon && iconPosition === 'right') && <span className="flex absolute right-1 top-2.5 h-2">{icon}</span>}
      {(!icon) && <span className="flex absolute right-1 top-2.5 h-2">{icone}</span>}
    </div>
  );
}