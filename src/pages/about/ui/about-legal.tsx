import { useTranslation } from 'react-i18next';

export function AboutLegal() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-12 md:pb-16">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t('pages.about.legal.heading')}</h2>
      <div className="mt-6 space-y-3 text-sm text-muted-foreground">
        <p>{t('footer.legalEntity')}</p>
        <p>{t('footer.disclaimer')}</p>
      </div>
    </section>
  );
}
