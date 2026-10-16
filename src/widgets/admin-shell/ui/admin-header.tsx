import { useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/features/switch-language';
import { Separator } from '@/shared/ui/separator';
import { SidebarTrigger } from '@/shared/ui/sidebar';
import { ADMIN_NAV } from '../model/navigation';

export function AdminHeader() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const current = ADMIN_NAV.find((item) => pathname.startsWith(item.to));

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        {current ? <span className="text-sm font-medium">{t(current.titleKey)}</span> : null}
      </div>
      <div className="ml-auto flex items-center gap-2 px-4">
        <LanguageSwitcher />
      </div>
    </header>
  );
}
