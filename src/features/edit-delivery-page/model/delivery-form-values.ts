import { isPaymentActive, type DeliveryPageContent } from '@/entities/delivery-page';
import type { DeliveryFormValues } from './delivery-form-schema';

export function toDefaultValues(content: DeliveryPageContent): DeliveryFormValues {
  return {
    ...content,
    payment: content.payment.map((card, index) => ({ ...card, enabled: isPaymentActive(card, index) })),
    documents: content.documents.map((text) => ({ text })),
  };
}

export function toInput(values: DeliveryFormValues): DeliveryPageContent {
  return { ...values, documents: values.documents.map((document) => document.text) };
}
