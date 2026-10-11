import { AtSign, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SITE_INSTAGRAM_HANDLE, SITE_INSTAGRAM_URL, SITE_STORES } from '@/shared/config';
import { AboutContactRow } from './about-contact-row';

export function AboutStores() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-12 md:pb-16">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t('pages.about.stores.heading')}</h2>
      <ul className="mt-6 grid gap-4">
        {SITE_STORES.map((store) => {
          const address = t(`stores.${store.id}.address`);
          return (
            <li key={store.id} className="grid gap-4 lg:grid-cols-[1fr_2fr]">
              <div className="flex flex-col divide-y overflow-hidden rounded-xl border bg-card">
                <AboutContactRow icon={MapPin} label={t('pages.about.stores.addressLabel')} value={address} />
                <AboutContactRow
                  icon={Phone}
                  label={t('pages.about.stores.phoneLabel')}
                  value={store.phoneLabel}
                  href={`tel:${store.phone}`}
                />
                <AboutContactRow
                  icon={AtSign}
                  label={t('pages.about.stores.instagram')}
                  value={SITE_INSTAGRAM_HANDLE}
                  href={SITE_INSTAGRAM_URL}
                  isExternal
                />
              </div>
              <iframe
                src={store.mapEmbedUrl}
                title={t('pages.about.stores.mapTitle', { address })}
                className="h-80 w-full rounded-xl border-0 lg:h-full lg:min-h-80"
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
