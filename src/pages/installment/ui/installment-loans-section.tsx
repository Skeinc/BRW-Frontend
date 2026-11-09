import { useTranslation } from 'react-i18next';
import { PageSection } from '@/shared/ui/page-section';
import { useInstallmentContent } from '../model/use-installment-content';
import { InstallmentLoanCard } from './installment-loan-card';

export function InstallmentLoansSection() {
  const { t } = useTranslation();
  const base = 'pages.installment.loans';
  const { loans } = useInstallmentContent();
  return (
    <PageSection id="loans" heading={t(`${base}.heading`)} lead={t(`${base}.lead`)}>
      <ul className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loans.map((loan, index) => (
          <InstallmentLoanCard key={index} loan={loan} />
        ))}
      </ul>
    </PageSection>
  );
}
