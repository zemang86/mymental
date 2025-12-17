import { redirect } from 'next/navigation';
import { checkAdminAccess } from '@/lib/admin/auth';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminHeader } from '@/components/admin/header';

export const metadata = {
  title: 'Admin Dashboard | Serini',
  description: 'Serini Administration Dashboard',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await checkAdminAccess();

  // Don't check auth for login page
  const isLoginPage = false; // Will be handled by page itself

  if (!admin && !isLoginPage) {
    // Let login page handle its own layout
    return children;
  }

  // If we have admin, show full layout
  if (admin) {
    return (
      <div className="min-h-screen bg-neutral-900">
        <AdminSidebar admin={admin} />
        <div className="lg:pl-64">
          <AdminHeader admin={admin} />
          <main className="p-6">{children}</main>
        </div>
      </div>
    );
  }

  // For login page or unauthenticated users
  return children;
}
