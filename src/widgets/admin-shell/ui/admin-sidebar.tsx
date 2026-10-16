import { Link } from '@tanstack/react-router';
import { Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/shared/ui/sidebar';
import { AdminNavMain } from './admin-nav-main';
import { AdminNavUser } from './admin-nav-user';

export function AdminSidebar() {
  const { t } = useTranslation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip={t('admin.title')}>
              <Link to="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Store className="size-4" aria-hidden />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{t('app.name')}</span>
                  <span className="truncate text-xs text-muted-foreground">{t('admin.panel')}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AdminNavMain />
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
