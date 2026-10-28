import { Link } from '@tanstack/react-router';
import { Clock, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SITE_PHONE, SITE_PHONE_LABEL } from '@/shared/config';

/**
 * Dark band above the header (colours of the footer), as on brw-shop.by: store address, opening hours and phone.
 * Hidden on phones, where the header has its own call button.
 */
export function HeaderTopBar() {
  const { t } = useTranslation();
  return (
    <div className="hidden bg-foreground text-sm text-background md:block">
      <div className="mx-auto flex h-11 w-full max-w-7xl items-center gap-6 px-4">
        <Link to="/about" className="inline-flex items-center gap-2 hover:underline">
          <MapPin aria-hidden className="size-4 shrink-0" />
          {t('stores.nepokorennykh.address')}
        </Link>
        <span className="ml-auto inline-flex items-center gap-2">
          <Clock aria-hidden className="size-4 shrink-0" />
          {t('header.hours')}
        </span>
        <a
          href={`tel:${SITE_PHONE}`}
          className="tabular-price inline-flex items-center gap-2 font-semibold hover:underline"
        >
          <Phone aria-hidden className="size-4 shrink-0" />
          {SITE_PHONE_LABEL}
        </a>
      </div>
    </div>
  );
}
