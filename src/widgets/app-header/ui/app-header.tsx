import { Link } from '@tanstack/react-router';
import { Phone, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCartLines } from '@/entities/cart';
import { SITE_PHONE, SITE_PHONE_LABEL } from '@/shared/config';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { HeaderSearch } from './header-search';

export function AppHeader() {
  const { t } = useTranslation();
  const itemCount = useCartLines().reduce((sum, line) => sum + line.qty, 0);
  return (
    <header className="sticky top-0 z-40 border-b bg-card">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary" aria-label={t('nav.goHome')}>
          {t('app.name')}
        </Link>
        <Button asChild className="hidden h-11 sm:inline-flex">
          <Link to="/catalog">{t('nav.catalog')}</Link>
        </Button>
        <HeaderSearch />
        <a
          href={`tel:${SITE_PHONE}`}
          className="hidden h-11 items-center gap-2 text-sm font-semibold lg:flex"
          aria-label={t('header.phoneLabel')}
        >
          <Phone className="size-4 text-primary" aria-hidden />
          <span className="tabular-price">{SITE_PHONE_LABEL}</span>
        </a>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-11"
          aria-label={t('nav.cartWithCount', { count: itemCount })}
        >
          <ShoppingCart aria-hidden />
          {itemCount > 0 && (
            <Badge className="absolute -right-1 -top-1 min-w-5 justify-center px-1 tabular-nums">{itemCount}</Badge>
          )}
        </Button>
      </div>
    </header>
  );
}
