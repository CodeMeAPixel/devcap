import React from 'react';
import { cn } from '@/lib/utils';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'elevated';
}

export function Panel({
  children,
  className,
  variant = 'default',
  ...props
}: PanelProps) {
  return (
    <div
      className={cn(
        'rounded-lg p-4',
        {
          'bg-white dark:bg-gray-800': variant === 'default',
          'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800': variant === 'outline',
          'bg-white dark:bg-gray-800 shadow-md': variant === 'elevated',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface PanelHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PanelHeader({
  children,
  className,
  ...props
}: PanelHeaderProps) {
  return (
    <div
      className={cn('mb-4 pb-4 border-b border-gray-200 dark:border-gray-700', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface PanelTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function PanelTitle({
  children,
  className,
  ...props
}: PanelTitleProps) {
  return (
    <h2
      className={cn('text-lg font-semibold', className)}
      {...props}
    >
      {children}
    </h2>
  );
}

interface PanelBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PanelBody({
  children,
  className,
  ...props
}: PanelBodyProps) {
  return (
    <div
      className={cn('', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface PanelFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PanelFooter({
  children,
  className,
  ...props
}: PanelFooterProps) {
  return (
    <div
      className={cn('mt-4 pt-4 border-t border-gray-200 dark:border-gray-700', className)}
      {...props}
    >
      {children}
    </div>
  );
}
