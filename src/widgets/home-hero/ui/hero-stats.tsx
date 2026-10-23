import { useTranslation } from 'react-i18next';

const STATS = ['years', 'models', 'installment'] as const;

export function HeroStats() {
  const { t } = useTranslation();
  return (
    <dl className="mt-10 grid max-w-xl grid-cols-3 divide-x rounded-2xl border bg-card/70 py-4 backdrop-blur">
      {STATS.map((stat) => (
        <div key={stat} className="px-4 first:pl-5 sm:px-6">
          <dd className="tabular-price text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
            {t(`pages.home.hero.stats.${stat}.value`)}
          </dd>
          <dt className="mt-1 text-xs text-muted-foreground sm:text-sm">{t(`pages.home.hero.stats.${stat}.label`)}</dt>
        </div>
      ))}
    </dl>
  );
}
