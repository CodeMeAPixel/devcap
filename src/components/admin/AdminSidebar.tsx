'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart, 
  Users, 
  Briefcase, 
  Users2, 
  Zap, 
  Award,
  Settings,
  LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export function AdminSidebar() {
  const pathname = usePathname();
  
  const menuItems = [
    { href: '/admin', icon: <BarChart size={20} />, label: 'Dashboard' },
    { href: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { href: '/admin/businesses', icon: <Briefcase size={20} />, label: 'Businesses' },
    { href: '/admin/team-members', icon: <Users2 size={20} />, label: 'Team Members' },
    { href: '/admin/upgrades', icon: <Zap size={20} />, label: 'Upgrades' },
    { href: '/admin/achievements', icon: <Award size={20} />, label: 'Achievements' },
    { href: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' }
  ];
  
  return (
    <div className="w-64 min-h-screen bg-card border-r border-border p-4 hidden md:block">
      <div className="mb-6 px-2 py-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text">
          Dev Cap Admin
        </h1>
        <p className="text-sm text-muted-foreground">Manage your idle game</p>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              pathname === item.href
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-accent text-muted-foreground hover:text-accent-foreground'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
        
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center px-3 py-2 rounded-md transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground mt-8"
        >
          <span className="mr-3"><LogOut size={20} /></span>
          Sign Out
        </button>
      </nav>
    </div>
  );
}
