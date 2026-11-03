import { Link } from '@tanstack/react-router';
import { Clock, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/utils';
import { SITE_PHONE, SITE_PHONE_LABEL } from '@/shared/config';

const ICON_BADGE =
  'flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary transition-colors';

/**
 * Dark band above the header (colours of the footer), as on brw-shop.by: store address, opening hours and phone.
 * Hidden on phones, where the header has its own call button.
 */
export function HeaderTopBar() {
  const { t } = useTranslation();
  return (
    <div className="hidden bg-foreground text-sm text-background md:block">
      <div className="mx-auto flex h-11 w-full max-w-6xl items-center gap-6 px-4">
        <Link to="/about" className="group inline-flex items-center gap-2.5 transition-colors hover:text-background/80">
          <span className={cn(ICON_BADGE, 'group-hover:bg-primary group-hover:text-primary-foreground')}>
            <MapPin aria-hidden className="size-3.5" />
          </span>
          {t('stores.nepokorennykh.address')}
        </Link>
        <span className="ml-auto inline-flex items-center gap-2.5">
          <span className={ICON_BADGE}>
            <Clock aria-hidden className="size-3.5" />
          </span>
          {t('header.hours')}
        </span>
        <span aria-hidden className="h-4 w-px bg-background/20" />
        <a
          href={`tel:${SITE_PHONE}`}
          className="tabular-price group inline-flex items-center gap-2.5 font-semibold transition-colors hover:text-background/80"
        >
          <span className={cn(ICON_BADGE, 'group-hover:bg-primary group-hover:text-primary-foreground')}>
            <Phone aria-hidden className="size-3.5" />
          </span>
          {SITE_PHONE_LABEL}
        </a>
      </div>
    </div>
  );
}
