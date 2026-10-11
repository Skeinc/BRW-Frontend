import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { SITE_PHONE, SITE_PHONE_LABEL } from '@/shared/config';

const CURRENT_YEAR = new Date().getFullYear();

export function AppFooter() {
  const { t } = useTranslation();
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2">
        <div>
          <p className="text-xl font-extrabold text-primary">{t('app.name')}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t('app.tagline')}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold">{t('footer.contacts')}</p>
          <a href={`tel:${SITE_PHONE}`} className="tabular-price hover:text-primary">
            {SITE_PHONE_LABEL}
          </a>
          <Link to="/catalog" className="hover:text-primary">
            {t('footer.catalog')}
          </Link>
        </div>
      </div>
      <p className="border-t py-4 text-center text-xs text-muted-foreground">
        {t('footer.rights', { year: CURRENT_YEAR })}
      </p>
    </footer>
  );
}
