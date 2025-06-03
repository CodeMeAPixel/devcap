import React from 'react';
import { cn } from '@/lib/utils';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

export function Form({ className, ...props }: FormProps) {
  return (
    <form className={cn('space-y-4', className)} {...props} />
  );
}

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FormField({ className, ...props }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)} {...props} />
  );
}

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function FormLabel({ className, ...props }: FormLabelProps) {
  return (
    <label 
      className={cn('block text-sm font-medium', className)} 
      {...props} 
    />
  );
}

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function FormDescription({ className, ...props }: FormDescriptionProps) {
  return (
    <p 
      className={cn('text-xs text-muted-foreground mt-1', className)} 
      {...props} 
    />
  );
}

export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function FormError({ className, ...props }: FormErrorProps) {
  return (
    <p 
      className={cn('text-xs text-red-500 dark:text-red-400 mt-1', className)} 
      {...props} 
    />
  );
}

export interface FormSectionProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  title?: string;
  description?: string;
}

export function FormSection({ 
  className,
  title,
  description,
  children,
  ...props 
}: FormSectionProps) {
  return (
    <fieldset 
      className={cn('border border-gray-200 dark:border-gray-700 rounded-lg p-4', className)} 
      {...props}
    >
      {title && <legend className="text-sm font-medium px-2">{title}</legend>}
      {description && <p className="text-xs text-muted-foreground mt-1 mb-3">{description}</p>}
      <div className="space-y-4">
        {children}
      </div>
    </fieldset>
  );
}
