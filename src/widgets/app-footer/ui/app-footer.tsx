import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { SITE_INSTAGRAM_URL, SITE_PHONE, SITE_PHONE_LABEL, SITE_STORES } from '@/shared/config';
import { catalogCategoriesQueryOptions } from '@/entities/category';
import { catalogRoomsQueryOptions } from '@/entities/room';
import { CookieSettingsButton } from '@/features/cookie-consent';
import { BrandLogo } from '@/shared/ui/brand-logo';
import { FooterHeading } from './footer-heading';
import { FooterPayment } from './footer-payment';

const CURRENT_YEAR = new Date().getFullYear();
const SITE_EMAIL = 'info@brw-shop.by';
const LINK_CLASS = 'hover:text-primary';

const COMPANY_LINKS = [
  { to: '/delivery-and-payment', labelKey: 'nav.deliveryAndPayment' },
  { to: '/installment', labelKey: 'nav.installment' },
  { to: '/articles', labelKey: 'nav.articles' },
  { to: '/news', labelKey: 'nav.news' },
  { to: '/about', labelKey: 'nav.about' },
  { to: '/faq', labelKey: 'nav.faq' },
  { to: '/privacy', labelKey: 'nav.privacy' },
] as const;

export function AppFooter() {
  const { t } = useTranslation();
  const { data: categories = [] } = useQuery(catalogCategoriesQueryOptions);
  const { data: rooms = [] } = useQuery(catalogRoomsQueryOptions);
  return (
    <footer className="mt-16 bg-foreground text-background">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.6fr_1.2fr_1.2fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo />
            <p className="mt-6 max-w-md text-sm text-background/60">{t('footer.description')}</p>
            <a href={`tel:${SITE_PHONE}`} className="tabular-price mt-4 block text-2xl font-bold">
              {SITE_PHONE_LABEL}
            </a>
            <p className="mt-2 text-sm text-background/60">{t('footer.hours')}</p>
            <a href={`mailto:${SITE_EMAIL}`} className={`mt-2 block text-sm ${LINK_CLASS}`}>
              {SITE_EMAIL}
            </a>
            <a
              href={SITE_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-2 block text-sm ${LINK_CLASS}`}
            >
              {t('footer.instagram')}
            </a>
          </div>
          <nav aria-labelledby="footer-rooms" className="flex flex-col gap-3 text-sm">
            <FooterHeading id="footer-rooms">{t('footer.byRoom')}</FooterHeading>
            {rooms.map((room) => (
              <Link key={room.id} to="/room/$roomId" params={{ roomId: room.id }} className={LINK_CLASS}>
                {room.name}
              </Link>
            ))}
          </nav>
          <nav aria-labelledby="footer-categories" className="flex flex-col gap-3 text-sm">
            <FooterHeading id="footer-categories">{t('footer.byCategory')}</FooterHeading>
            <div className="flex flex-col gap-3 sm:columns-2 sm:block sm:space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to="/catalog/$categoryId"
                  params={{ categoryId: category.id }}
                  className={`block break-inside-avoid ${LINK_CLASS}`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <Link to="/catalog" className="font-medium text-primary hover:underline">
              {t('footer.allCatalog')}
            </Link>
          </nav>
          <nav aria-labelledby="footer-company" className="flex flex-col gap-3 text-sm">
            <FooterHeading id="footer-company">{t('footer.company')}</FooterHeading>
            {COMPANY_LINKS.map(({ to, labelKey }) => (
              <Link key={to} to={to} className={LINK_CLASS}>
                {t(labelKey)}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-4 text-sm">
            <FooterHeading id="footer-network">{t('footer.network')}</FooterHeading>
            {SITE_STORES.map((store) => (
              <div key={store.id} className="flex flex-col gap-1">
                <p className="font-semibold">{t('stores.city')}</p>
                <p className="text-background/70">{t(`stores.${store.id}.street`)}</p>
                <a href={`tel:${store.phone}`} className={`tabular-price ${LINK_CLASS}`}>
                  {store.phoneLabel}
                </a>
              </div>
            ))}
          </div>
        </div>
        <FooterPayment />
        <div className="space-y-3 border-t border-background/15 py-6 text-xs text-background/60">
          <p>{t('footer.legalEntity')}</p>
          <p>{t('footer.disclaimer')}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-background/15 py-6 text-xs text-background/60">
          <p>{t('footer.rights', { year: CURRENT_YEAR })}</p>
          <CookieSettingsButton />
        </div>
      </div>
    </footer>
  );
}
