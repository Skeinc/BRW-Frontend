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
      <SidebarInset className="h-svh">
        <AdminHeader />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-4 pt-1.5 pb-4 md:px-8 md:pb-8">
          <Outlet />
        </div>
      </SidebarInset>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}
