import React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/lib/utils';

interface GameEntityProps {
  name: string;
  description: string;
  imageUrl?: string;
  iconUrl?: string;
  primaryStat: {
    label: string;
    value: number | string;
  };
  secondaryStat?: {
    label: string;
    value: number | string;
  };
  actionButton: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  additionalContent?: React.ReactNode;
  variant?: 'business' | 'team' | 'upgrade' | 'achievement';
}

export function GameEntity({
  name,
  description,
  imageUrl,
  iconUrl,
  primaryStat,
  secondaryStat,
  actionButton,
  additionalContent,
  variant = 'business',
}: GameEntityProps) {
  return (
    <Card variant={variant}>
      <CardHeader className="pb-2 flex flex-row items-center gap-3">
        {iconUrl && (
          <div className="w-8 h-8 relative">
            <Image
              src={iconUrl}
              alt={name}
              fill
              className="object-contain"
            />
          </div>
        )}
        <div className="flex-1">
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      
      {imageUrl && (
        <div className="relative w-full h-32 overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium">
            {primaryStat.label}:
            <span className="ml-1 font-mono text-primary">{primaryStat.value}</span>
          </div>
          
          {secondaryStat && (
            <div className="text-sm font-medium">
              {secondaryStat.label}:
              <span className="ml-1 font-mono">{secondaryStat.value}</span>
            </div>
          )}
        </div>
        
        {additionalContent}
      </CardContent>
      
      <CardFooter className="border-t pt-3">
        <Button 
          onClick={actionButton.onClick}
          disabled={actionButton.disabled}
          className="w-full"
          variant="default"
        >
          {actionButton.label}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function BusinessCard({
  business,
  level,
  cost,
  production,
  onPurchase,
  canAfford,
}: {
  business: any;
  level: number;
  cost: number;
  production: number;
  onPurchase: () => void;
  canAfford: boolean;
}) {
  return (
    <GameEntity
      name={business.name}
      description={business.description}
      imageUrl={business.imageUrl}
      iconUrl={business.iconUrl}
      variant="business"
      primaryStat={{
        label: "Level",
        value: level
      }}
      secondaryStat={{
        label: "Production",
        value: `${formatNumber(production)} LoC/s`
      }}
      actionButton={{
        label: level === 0 ? `Buy for ${formatNumber(cost)} LoC` : `Upgrade for ${formatNumber(cost)} LoC`,
        onClick: onPurchase,
        disabled: !canAfford
      }}
      additionalContent={
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full" 
            style={{ width: `${Math.min(100, level * 10)}%` }}
          />
        </div>
      }
    />
  );
}
