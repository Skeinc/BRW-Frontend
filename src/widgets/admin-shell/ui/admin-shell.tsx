import { Outlet } from '@tanstack/react-router';
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar';
import { Toaster } from '@/shared/ui/sonner';
import { useSessionExpiry } from '../model/use-session-expiry';
import { AdminHeader } from './admin-header';
import { AdminSidebar } from './admin-sidebar';

export function AdminShell() {
  useSessionExpiry();

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <div className="min-w-0 flex-1 p-4 pt-0 md:p-8 md:pt-0">
          <Outlet />
        </div>
      </SidebarInset>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}
