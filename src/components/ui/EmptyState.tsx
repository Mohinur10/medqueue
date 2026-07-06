
import React from 'react';
 
import { LucideIcon } from 'lucide-react';
 
import { Button } from './Button';
 interface EmptyStateProps { icon: LucideIcon;
 title: string;
 description: string;
 actionText?: string;
 onAction?: () => void;
 } 
export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, actionText, onAction }) => { 
return ( <div className="flex flex-col items-center justify-center p-8 text-center bg-card text-card-foreground/30 border border-border/50 rounded-2xl backdrop-blur-sm"> <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-secondary text-secondary-foreground/50 border border-border /50 text-muted-foreground mb-4 shadow-sm dark:shadow-[0_0_15px_rgba(3,7,18,0.3)]"> <Icon className="h-6 w-6 text-muted-foreground" /> </div> <h3 className="text-sm font-semibold text-foreground "> {title} </h3> <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1.5 max-w-xs leading-relaxed"> {description} </p> {actionText && onAction && ( <Button variant="primary" size="sm" onClick={onAction} className="mt-4 cursor-pointer" > {actionText} </Button> )} </div> );
 };
 