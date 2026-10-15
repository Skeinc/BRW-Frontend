import { useTranslation } from 'react-i18next';
import { PageSection } from '@/shared/ui/page-section';
import { LOAN_OFFERS } from '../model/offers';
import { InstallmentLoanCard } from './installment-loan-card';

export function InstallmentLoansSection() {
  const { t } = useTranslation();
  const base = 'pages.installment.loans';
  return (
    <PageSection id="loans" heading={t(`${base}.heading`)} lead={t(`${base}.lead`)}>
      <ul className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        {LOAN_OFFERS.map((offer) => (
          <InstallmentLoanCard key={offer.id} offer={offer} />
        ))}
      </ul>
    </PageSection>
  );
}
