import { ContactCta } from '@/widgets/contact-cta';
import { InstallmentCardsSection } from './installment-cards-section';
import { InstallmentHero } from './installment-hero';
import { InstallmentLoansSection } from './installment-loans-section';
import { InstallmentNotice } from './installment-notice';
import { InstallmentQuickNav } from './installment-quick-nav';
import { InstallmentSteps } from './installment-steps';

export function InstallmentPage() {
  return (
    <>
      <InstallmentHero />
      <InstallmentQuickNav />
      <InstallmentCardsSection />
      <InstallmentLoansSection />
      <InstallmentSteps />
      <InstallmentNotice />
      <ContactCta />
    </>
  );
}
