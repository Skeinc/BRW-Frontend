import type { DeliveryPagePaymentCard } from '../model/types';

const CARD_PAYMENT_INDEX = 2;

/** A payment method is active unless it was switched off; before the first save only the bank card is off. */
export function isPaymentActive(card: DeliveryPagePaymentCard, index: number): boolean {
  return card.enabled ?? index !== CARD_PAYMENT_INDEX;
}
