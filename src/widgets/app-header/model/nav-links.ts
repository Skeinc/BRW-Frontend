import type { LinkProps } from '@tanstack/react-router';

export interface NavLink {
  to: NonNullable<LinkProps['to']>;
  labelKey: string;
}

/** Links of the main menu next to the catalog menu, in the order of brw-shop.by. */
export const NAV_LINKS: readonly NavLink[] = [
  { to: '/delivery-and-payment', labelKey: 'nav.deliveryAndPayment' },
  { to: '/installment', labelKey: 'nav.installment' },
  { to: '/articles', labelKey: 'nav.articles' },
  { to: '/news', labelKey: 'nav.news' },
  { to: '/about', labelKey: 'nav.about' },
];

export const NAV_LINK_CLASS =
  'inline-flex h-20 items-center border-b-2 border-transparent px-3 text-[0.9375rem] font-medium transition-colors hover:text-primary xl:px-4';
