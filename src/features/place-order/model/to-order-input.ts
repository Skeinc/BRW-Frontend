import type { CreateOrderInput } from '@/entities/order';
import type { CartLine } from '@/entities/cart';
import type { CheckoutFormValues } from './checkout-form-schema';

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

export function toOrderInput(values: CheckoutFormValues, lines: readonly CartLine[]): CreateOrderInput {
  const isDelivery = values.deliveryMethod === 'delivery';
  return {
    contactName: values.contactName.trim(),
    phone: values.phone,
    email: emptyToUndefined(values.email),
    deliveryMethod: values.deliveryMethod,
    city: isDelivery ? emptyToUndefined(values.city) : undefined,
    address: isDelivery ? emptyToUndefined(values.address) : undefined,
    paymentMethod: values.paymentMethod,
    comment: emptyToUndefined(values.comment),
    consent: true,
    items: lines.map(({ productId, qty }) => ({ productId, qty })),
  };
}
