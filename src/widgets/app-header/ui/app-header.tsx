import { Link } from '@tanstack/react-router';
import { LayoutGrid, Phone, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCartCount } from '@/entities/cart';
import { LanguageSwitcher } from '@/features/switch-language';
import { SITE_PHONE } from '@/shared/config';
import { Badge } from '@/shared/ui/badge';
import { BrandLogo } from '@/shared/ui/brand-logo';
import { Button } from '@/shared/ui/button';
import { HeaderSearch } from './header-search';
import { HeaderTopBar } from './header-top-bar';

export function AppHeader() {
  const { t } = useTranslation();
  const itemCount = useCartCount();
  return (
    /* The grey top bar stays pinned together with the header (44px taller from md, see the offsets of sticky blocks). */
    <div className="sticky top-0 z-40">
      <HeaderTopBar />
      <header className="border-b bg-card">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center gap-x-2 gap-y-2 px-4 py-2 sm:h-20 sm:flex-nowrap sm:gap-x-3 sm:py-0 lg:gap-5">
          <Link to="/" aria-label={t('nav.goHome')} className="shrink-0">
            <BrandLogo tone="onLight" />
          </Link>
          <Button asChild className="hidden h-12 px-5 sm:inline-flex">
            <Link to="/catalog">
              <LayoutGrid aria-hidden />
              {t('nav.catalog')}
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon" className="ml-auto size-12 shrink-0 sm:hidden">
            <Link to="/catalog" aria-label={t('nav.catalog')}>
              <LayoutGrid aria-hidden />
            </Link>
          </Button>
          <HeaderSearch />
          <LanguageSwitcher />
          <Button
            asChild
            variant="outline"
            className="relative h-12 shrink-0 px-3 sm:px-4"
            aria-label={t('nav.cartWithCount', { count: itemCount })}
          >
            <Link to="/cart">
              <ShoppingCart aria-hidden />
              <span className="hidden sm:inline">{t('nav.cart')}</span>
              {itemCount > 0 && (
                <Badge className="absolute -right-2 -top-2 min-w-5 justify-center rounded-full px-1 tabular-nums">
                  {itemCount}
                </Badge>
              )}
            </Link>
          </Button>
          <Button asChild size="icon" className="size-12 shrink-0 md:hidden">
            <a href={`tel:${SITE_PHONE}`} aria-label={t('header.phoneLabel')}>
              <Phone aria-hidden />
            </a>
          </Button>
        </div>
      </header>
    </div>
  );
}
