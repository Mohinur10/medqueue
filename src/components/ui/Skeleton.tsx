
import React from 'react';
 interface SkeletonProps { className?: string;
 variant?: 'text' | 'rect' | 'circle';
 } 
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => { const baseStyle = 'animate-pulse bg-slate-200 /60';
 const variants = { text: 'h-4 rounded w-3/4', rect: 'rounded-lg h-24 w-full', circle: 'rounded-full h-12 w-12' };
 
return ( <div className={`${baseStyle} ${variants[variant]} ${className}`} /> );
 };
 