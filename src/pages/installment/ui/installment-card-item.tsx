import { useTranslation } from 'react-i18next';
import type { CardOffer } from '../model/offers';

interface InstallmentCardItemProps {
  offer: CardOffer;
}

export function InstallmentCardItem({ offer }: InstallmentCardItemProps) {
  const { t } = useTranslation();
  const base = 'pages.installment.cards';
  return (
    <li className="flex flex-col rounded-xl border bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {t(`${base}.items.${offer.id}.note`)}
      </p>
      <h3 className="mt-1 text-xl font-semibold">{t(`${base}.items.${offer.id}.name`)}</h3>
      <p className="tabular-price mt-6 text-5xl font-bold text-primary">
        {t(`${base}.months`, { count: offer.months })}
      </p>
      <dl className="mt-6 space-y-3 border-t pt-4 text-sm">
        <div>
          <dt className="text-muted-foreground">{t(`${base}.rateLabel`)}</dt>
          <dd className="mt-0.5 font-semibold">{t(`${base}.rates.${offer.rate}`)}</dd>
        </div>
        {offer.payDay !== null && (
          <div>
            <dt className="text-muted-foreground">{t(`${base}.payDayLabel`)}</dt>
            <dd className="mt-0.5 font-semibold">{t(`${base}.payDay`, { day: offer.payDay })}</dd>
          </div>
        )}
      </dl>
    </li>
  );
}
