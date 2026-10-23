import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { SITE_INSTAGRAM_URL, SITE_PHONE, SITE_PHONE_LABEL, SITE_STORES } from '@/shared/config';
import { catalogCategoriesQueryOptions } from '@/entities/category';
import { CookieSettingsButton } from '@/features/cookie-consent';
import { BrandLogo } from '@/shared/ui/brand-logo';

const CURRENT_YEAR = new Date().getFullYear();
const SITE_EMAIL = 'info@brw-shop.by';

export function AppFooter() {
  const { t } = useTranslation();
  const { data: categories = [] } = useQuery(catalogCategoriesQueryOptions);
  return (
    <footer className="mt-16 bg-foreground text-background">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1.5fr]">
          <div>
            <BrandLogo />
            <p className="mt-6 max-w-md text-sm text-background/60">{t('footer.description')}</p>
            <a href={`tel:${SITE_PHONE}`} className="tabular-price mt-4 block text-2xl font-bold">
              {SITE_PHONE_LABEL}
            </a>
            <p className="mt-2 text-sm text-background/60">{t('footer.hours')}</p>
          </div>
          <nav aria-labelledby="footer-catalog" className="flex flex-col gap-3 text-sm">
            <p id="footer-catalog" className="text-xs font-semibold uppercase tracking-widest text-background/60">
              {t('nav.catalog')}
            </p>
            {categories.map((category) => (
              <Link
                key={category.id}
                to="/catalog/$categoryId"
                params={{ categoryId: category.id }}
                className="hover:text-primary"
              >
                {category.name}
              </Link>
            ))}
            <Link to="/catalog" className="font-medium text-primary hover:underline">
              {t('footer.allCatalog')}
            </Link>
          </nav>
          <nav aria-labelledby="footer-navigation" className="flex flex-col gap-3 text-sm">
            <p id="footer-navigation" className="text-xs font-semibold uppercase tracking-widest text-background/60">
              {t('footer.navigation')}
            </p>
            <Link to="/about" className="hover:text-primary">
              {t('nav.about')}
            </Link>
            <Link to="/delivery-and-payment" className="hover:text-primary">
              {t('nav.deliveryAndPayment')}
            </Link>
            <Link to="/installment" className="hover:text-primary">
              {t('nav.installment')}
            </Link>
            <Link to="/articles" className="hover:text-primary">
              {t('nav.articles')}
            </Link>
            <Link to="/admin" className="hover:text-primary">
              {t('nav.adminPanel')}
            </Link>
          </nav>
          <div className="flex flex-col gap-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-background/60">{t('footer.contacts')}</p>
            {SITE_STORES.map((store) => (
              <div key={store.id} className="flex flex-col gap-1">
                <p>{t(`stores.${store.id}.address`)}</p>
                <a href={`tel:${store.phone}`} className="tabular-price hover:text-primary">
                  {store.phoneLabel}
                </a>
              </div>
            ))}
            <a href={`mailto:${SITE_EMAIL}`} className="hover:text-primary">
              {SITE_EMAIL}
            </a>
            <a href={SITE_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              {t('footer.instagram')}
            </a>
          </div>
        </div>
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
