
import React from 'react';
 interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
 size?: 'sm' | 'md' | 'lg';
 isLoading?: boolean;
 } 
export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', isLoading = false, className = '', disabled, type = 'button', ...props }) => { const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 active:scale-98 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
 const variants = { primary: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/35 hover:bg-cyan-500/20 hover:border-cyan-500/60 shadow-sm dark:shadow-[0_0_12px_rgba(6,182,212,0.15)] focus:ring-1 focus:ring-cyan-500/50', secondary: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/35 hover:bg-blue-500/20 hover:border-blue-500/60 shadow-sm dark:shadow-[0_0_12px_rgba(59,130,246,0.15)] focus:ring-1 focus:ring-blue-500/50', danger: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/35 hover:bg-rose-500/20 hover:border-rose-500/60 shadow-sm dark:shadow-[0_0_12px_rgba(244,63,94,0.15)] focus:ring-1 focus:ring-rose-500/50', ghost: 'text-muted-foreground hover:text-foreground dark:hover:text-foreground hover:bg-accent hover:text-accent-foreground/50' };
 const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
 
return ( <button type={type} disabled={disabled || isLoading} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props} > {isLoading ? ( <> <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /> </svg> Loading... </> ) : children} </button> );
 };
 