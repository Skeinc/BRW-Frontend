import {
  ChartColumn,
  FileText,
  FolderTree,
  Inbox,
  Layers,
  Newspaper,
  Package,
  Boxes,
  Sofa,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface AdminNavItem {
  to:
    | '/admin/categories'
    | '/admin/collections'
    | '/admin/rooms'
    | '/admin/solutions'
    | '/admin/products'
    | '/admin/orders'
    | '/admin/articles'
    | '/admin/news'
    | '/admin/settings'
    | '/admin/analytics';
  titleKey: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { to: '/admin/analytics', titleKey: 'admin.nav.analytics', icon: ChartColumn },
  { to: '/admin/categories', titleKey: 'admin.nav.categories', icon: FolderTree },
  { to: '/admin/collections', titleKey: 'admin.nav.collections', icon: Layers },
  { to: '/admin/rooms', titleKey: 'admin.nav.rooms', icon: Sofa },
  { to: '/admin/solutions', titleKey: 'admin.nav.solutions', icon: Boxes },
  { to: '/admin/products', titleKey: 'admin.nav.products', icon: Package },
  { to: '/admin/orders', titleKey: 'admin.nav.orders', icon: Inbox },
  { to: '/admin/articles', titleKey: 'admin.nav.articles', icon: FileText },
  { to: '/admin/news', titleKey: 'admin.nav.news', icon: Newspaper },
  { to: '/admin/settings', titleKey: 'admin.nav.settings', icon: Settings },
];
