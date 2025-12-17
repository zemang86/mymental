'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Database,
  BarChart3,
  Bell,
  Shield,
  Settings,
  LogOut,
  FileText,
  CreditCard,
  Brain,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';
import type { AdminUser } from '@/lib/admin/auth';

interface AdminSidebarProps {
  admin: AdminUser;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Assessments',
    href: '/admin/assessments',
    icon: Brain,
  },
  {
    name: 'Interventions',
    href: '/admin/interventions',
    icon: BookOpen,
  },
  {
    name: 'Subscriptions',
    href: '/admin/subscriptions',
    icon: CreditCard,
  },
  {
    name: 'KB Articles',
    href: '/admin/kb',
    icon: FileText,
  },
  {
    name: 'Data Management',
    href: '/admin/data',
    icon: Database,
  },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    name: 'Alerts',
    href: '/admin/alerts',
    icon: Bell,
    badge: true,
  },
  {
    name: 'Audit Logs',
    href: '/admin/audit',
    icon: Shield,
  },
  {
    name: 'Crisis Alerts',
    href: '/admin/crisis',
    icon: AlertTriangle,
    badge: true,
  },
];

const bottomNavigation = [
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-neutral-800 border-r border-neutral-700 hidden lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-700">
        <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-white">Serini</h1>
          <p className="text-xs text-neutral-400">Admin Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-red-500" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="my-4 border-t border-neutral-700" />

        {/* Bottom Navigation */}
        <ul className="space-y-1">
          {bottomNavigation.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-neutral-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center">
            {admin.avatarUrl ? (
              <img
                src={admin.avatarUrl}
                alt={admin.fullName || admin.email}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <span className="text-sm font-medium text-white">
                {admin.email.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {admin.fullName || admin.email}
            </p>
            <p className="text-xs text-neutral-400 capitalize">{admin.role.replace('_', ' ')}</p>
          </div>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
