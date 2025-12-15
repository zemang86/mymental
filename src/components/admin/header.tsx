'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Bell,
  Search,
  X,
  ChevronRight,
  Home,
} from 'lucide-react';
import type { AdminUser } from '@/lib/admin/auth';

interface AdminHeaderProps {
  admin: AdminUser;
}

// Map paths to breadcrumb names
const pathNames: Record<string, string> = {
  admin: 'Dashboard',
  users: 'Users',
  assessments: 'Assessments',
  interventions: 'Interventions',
  subscriptions: 'Subscriptions',
  kb: 'KB Articles',
  data: 'Data Management',
  reports: 'Reports',
  alerts: 'Alerts',
  audit: 'Audit Logs',
  crisis: 'Crisis Alerts',
  settings: 'Settings',
};

export function AdminHeader({ admin }: AdminHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate breadcrumbs
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const name = pathNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    return { name, href };
  });

  return (
    <header className="sticky top-0 z-40 bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-800">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 text-neutral-400 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden lg:flex items-center gap-2 text-sm">
          <Link
            href="/admin"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
          </Link>
          {breadcrumbs.slice(1).map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-neutral-600" />
              {index === breadcrumbs.length - 2 ? (
                <span className="text-white font-medium">{crumb.name}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {crumb.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Search and Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded-lg border border-neutral-700">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder-neutral-500 w-48"
            />
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-xs text-neutral-500 bg-neutral-700 rounded">
              ⌘K
            </kbd>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-neutral-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Avatar (Mobile) */}
          <div className="lg:hidden">
            <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
              {admin.avatarUrl ? (
                <img
                  src={admin.avatarUrl}
                  alt={admin.fullName || admin.email}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <span className="text-xs font-medium text-white">
                  {admin.email.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Simplified */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-neutral-900 p-4">
          <nav className="space-y-2">
            <Link
              href="/admin"
              className="block px-3 py-2 text-neutral-300 hover:bg-neutral-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="block px-3 py-2 text-neutral-300 hover:bg-neutral-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Users
            </Link>
            <Link
              href="/admin/assessments"
              className="block px-3 py-2 text-neutral-300 hover:bg-neutral-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Assessments
            </Link>
            <Link
              href="/admin/reports"
              className="block px-3 py-2 text-neutral-300 hover:bg-neutral-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reports
            </Link>
            <Link
              href="/admin/alerts"
              className="block px-3 py-2 text-neutral-300 hover:bg-neutral-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Alerts
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
