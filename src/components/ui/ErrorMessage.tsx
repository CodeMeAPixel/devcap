import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const errorVariants = cva(
  'rounded-md p-4 border text-sm flex items-start gap-3',
  {
    variants: {
      variant: {
        default: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900',
        warning: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-900',
        info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ErrorMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof errorVariants> {
  title?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function ErrorMessage({
  className,
  variant,
  title,
  action,
  icon,
  children,
  ...props
}: ErrorMessageProps) {
  return (
    <div className={cn(errorVariants({ variant }), className)} {...props}>
      {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
      
      <div className="flex-grow">
        {title && <p className="font-medium mb-1">{title}</p>}
        <div className="text-sm opacity-90">{children}</div>
        
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}
