import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'business' | 'team' | 'upgrade' | 'achievement';
  hover?: boolean;
}

export function Card({
  className,
  variant = 'default',
  hover = true,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border shadow-sm',
        {
          'game-card': variant === 'default',
          'business-card': variant === 'business',
          'team-card': variant === 'team',
          'upgrade-card': variant === 'upgrade',
          'achievement-card': variant === 'achievement',
          'transition-all duration-300 hover:shadow-md hover:-translate-y-[2px]': hover,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({
  className,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn('px-6 py-4 flex flex-col space-y-1.5', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({
  className,
  children,
  ...props
}: CardTitleProps) {
  return (
    <h3
      className={cn('text-lg font-semibold leading-none', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({
  className,
  children,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({
  className,
  children,
  ...props
}: CardContentProps) {
  return (
    <div className={cn('px-6 py-4 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({
  className,
  children,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={cn('px-6 py-4 flex items-center', className)}
      {...props}
    >
      {children}
    </div>
  );
}
