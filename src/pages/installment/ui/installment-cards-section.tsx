import { BadgePercent } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Callout } from '@/shared/ui/callout';
import { PageSection } from '@/shared/ui/page-section';
import { CARD_OFFERS } from '../model/offers';
import { InstallmentCardItem } from './installment-card-item';

export function InstallmentCardsSection() {
  const { t } = useTranslation();
  const base = 'pages.installment.cards';
  return (
    <PageSection id="cards" heading={t(`${base}.heading`)} lead={t(`${base}.lead`)}>
      <ul className="grid gap-4 md:grid-cols-3">
        {CARD_OFFERS.map((offer) => (
          <InstallmentCardItem key={offer.id} offer={offer} />
        ))}
      </ul>
      <div className="mt-4">
        <Callout icon={BadgePercent} tone="warning" title={t(`${base}.notice.title`)}>
          <p>{t(`${base}.notice.text`)}</p>
        </Callout>
      </div>
    </PageSection>
  );
}
