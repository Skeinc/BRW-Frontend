import { ContactCta } from '@/widgets/contact-cta';
import { DeliveryAnchorNav } from './delivery-anchor-nav';
import { DeliveryFaq } from './delivery-faq';
import { DeliveryHero } from './delivery-hero';
import { DeliveryTerms } from './delivery-terms';
import { DocumentsList } from './documents-list';
import { OrderReceivingSteps } from './order-receiving-steps';
import { PaymentMethods } from './payment-methods';
import { ReturnsNotice } from './returns-notice';

export function DeliveryAndPaymentPage() {
  return (
    <>
      <DeliveryHero />
      <DeliveryAnchorNav />
      <PaymentMethods />
      <DeliveryTerms />
      <OrderReceivingSteps />
      <ReturnsNotice />
      <DocumentsList />
      <DeliveryFaq />
      <ContactCta />
    </>
  );
}
