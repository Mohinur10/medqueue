
import React from 'react';
 interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string;
 error?: string;
 icon?: React.ReactNode;
 } 
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, className = '', id, type = 'text', ...props }, ref) => { 
return ( <div className="w-full flex flex-col gap-1.5"> {label && ( <label htmlFor={id} className="text-xs font-semibold text-secondary-foreground dark:text-muted-foreground"> {label} </label> )} <div className="relative flex items-center"> {icon && ( <div className="absolute left-3 text-muted-foreground pointer-events-none"> {icon} </div> )} <input id={id} type={type} ref={ref} className={`w-full bg-card text-foreground placeholder-slate-400 dark:placeholder-slate-500 text-sm border rounded-lg py-2.5 px-3 transition-all duration-300 ${icon ? 'pl-10' : 'pl-3'} ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30' : 'border-border focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30' } ${className}`} {...props} /> </div> {error && ( <span className="text-xs text-rose-400 font-medium"> {error} </span> )} </div> );
 });
 Input.displayName = 'Input';
 