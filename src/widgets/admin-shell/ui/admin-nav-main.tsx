import { Link, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/shared/ui/sidebar';
import { ADMIN_NAV } from '../model/navigation';

export function AdminNavMain() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {ADMIN_NAV.map((item) => (
          <SidebarMenuItem key={item.to}>
            <SidebarMenuButton asChild tooltip={t(item.titleKey)} isActive={pathname.startsWith(item.to)}>
              <Link to={item.to} onClick={() => setOpenMobile(false)}>
                <item.icon />
                <span>{t(item.titleKey)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
