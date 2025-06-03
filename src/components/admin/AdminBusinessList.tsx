'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';

interface Business {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseProduction: number;
  costMultiplier: number;
  unlockRequirement: number;
  imageUrl?: string;
  iconUrl?: string;
}

interface AdminBusinessListProps {
  businesses: Business[];
}

export function AdminBusinessList({ businesses }: AdminBusinessListProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Businesses</h2>
        <Button variant="default" size="sm">
          Add Business
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary text-secondary-foreground">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Base Cost</th>
              <th className="p-2 text-left">Production</th>
              <th className="p-2 text-left">Unlock Req.</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((business) => (
              <tr 
                key={business.id} 
                className="border-b border-gray-200 dark:border-gray-800 hover:bg-secondary/50"
              >
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    {business.iconUrl && (
                      <div className="relative w-8 h-8 rounded-md overflow-hidden">
                        <Image 
                          src={business.iconUrl} 
                          alt={business.name} 
                          fill 
                          className="object-cover"
                          onError={(e) => {
                            (e.target as any).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <span className="font-medium">{business.name}</span>
                  </div>
                </td>
                <td className="p-2">{business.baseCost}</td>
                <td className="p-2">{business.baseProduction} LoC/s</td>
                <td className="p-2">{business.unlockRequirement} LoC</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedBusiness(business)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {businesses.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No businesses found. Add your first business to get started.
        </div>
      )}
      
      {/* We'd add a modal here for editing/creating businesses */}
    </div>
  );
}
