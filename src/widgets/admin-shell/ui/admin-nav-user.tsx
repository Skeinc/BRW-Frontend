import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { ChevronsUpDown, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { adminMeQueryOptions, logoutAdmin } from '@/entities/admin-session';
import { getApiErrorMessage } from '@/shared/api';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/shared/ui/sidebar';

export function AdminNavUser() {
  const { t } = useTranslation();
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useQuery(adminMeQueryOptions);
  const logout = useMutation({
    mutationFn: logoutAdmin,
    onSuccess: async () => {
      await navigate({ to: '/admin/login' });
      queryClient.removeQueries({ queryKey: ['admin'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, t)),
  });

  if (!me) {
    return null;
  }

  const initials = me.email.slice(0, 2).toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="rounded-lg">
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{t('admin.nav.administrator')}</span>
                <span className="truncate text-xs">{me.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="rounded-lg">
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{t('admin.nav.administrator')}</span>
                  <span className="truncate text-xs">{me.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={logout.isPending} onSelect={() => logout.mutate()}>
              <LogOut />
              {t('admin.nav.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
