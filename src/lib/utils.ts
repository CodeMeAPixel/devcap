import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format numbers with K, M, B suffix for readability
export function formatNumber(num: number): string {
  if (num === undefined || num === null) return '0';
  
  if (num < 1000) return num.toFixed(0);
  if (num < 1000000) return (num / 1000).toFixed(1) + 'k';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'm';
  return (num / 1000000000).toFixed(1) + 'b';
}

// Calculate the cost of a business based on level
export function calculateBusinessCost(baseCost: number, multiplier: number, level: number): number {
  return Math.floor(baseCost * Math.pow(multiplier, level));
}

// Calculate the cost of a team member based on count
export function calculateTeamCost(baseCost: number, multiplier: number, count: number): number {
  return Math.floor(baseCost * Math.pow(multiplier, count));
}

// Calculate time elapsed in a human-readable format
export function formatTimeElapsed(date: Date): string {
  const now = new Date();
  const elapsed = now.getTime() - date.getTime();
  
  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  
  return 'just now';
}

// Format a date to a time ago string (e.g., "2 hours ago")
export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} seconds`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''}`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''}`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
  
  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? 's' : ''}`;
}

// Get a human-readable production rate
export function getProductionRate(amount: number): string {
  if (amount < 0.1) {
    return `${(amount * 60).toFixed(1)} per minute`;
  }
  return `${amount.toFixed(1)} per second`;
}
