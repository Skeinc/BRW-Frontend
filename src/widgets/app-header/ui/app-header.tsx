import { Link } from '@tanstack/react-router';
import { LayoutGrid, Phone, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCartLines } from '@/entities/cart';
import { SITE_PHONE, SITE_PHONE_LABEL } from '@/shared/config';
import { Badge } from '@/shared/ui/badge';
import { BrandLogo } from '@/shared/ui/brand-logo';
import { Button } from '@/shared/ui/button';
import { HeaderSearch } from './header-search';

export function AppHeader() {
  const { t } = useTranslation();
  const itemCount = useCartLines().reduce((sum, line) => sum + line.qty, 0);
  return (
    <header className="sticky top-0 z-40 border-b bg-card">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center gap-3 px-4 lg:gap-5">
        <Link to="/" aria-label={t('nav.goHome')} className="shrink-0">
          <BrandLogo tone="onLight" />
        </Link>
        <Button asChild className="hidden h-12 px-5 sm:inline-flex">
          <Link to="/catalog">
            <LayoutGrid aria-hidden />
            {t('nav.catalog')}
          </Link>
        </Button>
        <HeaderSearch />
        <div className="hidden shrink-0 flex-col lg:flex">
          <a href={`tel:${SITE_PHONE}`} className="tabular-price font-bold">
            {SITE_PHONE_LABEL}
          </a>
          <span className="text-xs text-muted-foreground">{t('header.hours')}</span>
        </div>
        <Button
          variant="outline"
          className="relative h-12 shrink-0 px-3 sm:px-4"
          aria-label={t('nav.cartWithCount', { count: itemCount })}
        >
          <ShoppingCart aria-hidden />
          <span className="hidden sm:inline">{t('nav.cart')}</span>
          {itemCount > 0 && (
            <Badge className="absolute -right-2 -top-2 min-w-5 justify-center rounded-full px-1 tabular-nums">
              {itemCount}
            </Badge>
          )}
        </Button>
        <Button asChild size="icon" className="size-12 shrink-0 lg:hidden">
          <a href={`tel:${SITE_PHONE}`} aria-label={t('header.phoneLabel')}>
            <Phone aria-hidden />
          </a>
        </Button>
      </div>
    </header>
  );
}
