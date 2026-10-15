import { Clock, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SITE_PHONE, SITE_PHONE_LABEL } from '@/shared/config';
import { Button } from '@/shared/ui/button';

export function ContactCta() {
  const { t } = useTranslation();
  const base = 'contactCta';
  return (
    <section className="mx-auto w-full max-w-7xl px-4">
      <div className="grid gap-6 rounded-xl bg-foreground p-6 text-background md:grid-cols-[1.5fr_1fr] md:p-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t(`${base}.heading`)}</h2>
          <p className="mt-3 max-w-xl text-background/70">{t(`${base}.text`)}</p>
          <Button asChild className="mt-6 h-12 px-6">
            <a href={`tel:${SITE_PHONE}`}>
              <Phone aria-hidden />
              {t(`${base}.call`)} · <span className="tabular-price">{SITE_PHONE_LABEL}</span>
            </a>
          </Button>
        </div>
        <ul className="flex flex-col justify-center gap-3 text-sm text-background/80">
          <li className="flex items-start gap-3">
            <Clock aria-hidden className="mt-0.5 size-4 shrink-0" />
            {t('footer.hours')}
          </li>
          <li className="flex items-start gap-3">
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
            {t('stores.nepokorennykh.address')}
          </li>
        </ul>
      </div>
    </section>
  );
}
