import { ChartColumn, FileText, FolderTree, Inbox, Layers, Package, type LucideIcon } from 'lucide-react';

export interface AdminNavItem {
  to:
    | '/admin/categories'
    | '/admin/collections'
    | '/admin/products'
    | '/admin/orders'
    | '/admin/articles'
    | '/admin/analytics';
  titleKey: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { to: '/admin/analytics', titleKey: 'admin.nav.analytics', icon: ChartColumn },
  { to: '/admin/categories', titleKey: 'admin.nav.categories', icon: FolderTree },
  { to: '/admin/collections', titleKey: 'admin.nav.collections', icon: Layers },
  { to: '/admin/products', titleKey: 'admin.nav.products', icon: Package },
  { to: '/admin/orders', titleKey: 'admin.nav.orders', icon: Inbox },
  { to: '/admin/articles', titleKey: 'admin.nav.articles', icon: FileText },
];
