import { z } from 'zod';

/** International number as the API accepts it: `+` and 7 to 15 digits. */
const PHONE_PATTERN = /^\+[1-9]\d{6,14}$/;

export const DELIVERY_METHODS = ['delivery', 'pickup'] as const;
export const PAYMENT_METHODS = ['cash_on_delivery', 'installment', 'bank_transfer'] as const;

export const checkoutFormSchema = z
  .object({
    contactName: z
      .string()
      .trim()
      .min(1, { error: 'checkout.validation.required' })
      .max(120, { error: 'checkout.validation.tooLong' }),
    phone: z.string().regex(PHONE_PATTERN, { error: 'checkout.validation.phone' }),
    email: z
      .string()
      .trim()
      .max(255, { error: 'checkout.validation.tooLong' })
      .refine((value) => value === '' || z.email().safeParse(value).success, { error: 'checkout.validation.email' }),
    deliveryMethod: z.enum(DELIVERY_METHODS),
    city: z.string().trim().max(120, { error: 'checkout.validation.tooLong' }),
    address: z.string().trim().max(500, { error: 'checkout.validation.tooLong' }),
    paymentMethod: z.enum(PAYMENT_METHODS),
    comment: z.string().trim().max(2000, { error: 'checkout.validation.tooLong' }),
    consent: z.boolean().refine((value) => value, { error: 'checkout.validation.consent' }),
  })
  .superRefine((values, context) => {
    if (values.deliveryMethod !== 'delivery') {
      return;
    }
    for (const field of ['city', 'address'] as const) {
      if (values[field] === '') {
        context.addIssue({ code: 'custom', path: [field], message: 'checkout.validation.required' });
      }
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export const CHECKOUT_DEFAULT_VALUES: CheckoutFormValues = {
  contactName: '',
  phone: '',
  email: '',
  deliveryMethod: 'delivery',
  city: '',
  address: '',
  paymentMethod: 'cash_on_delivery',
  comment: '',
  consent: true,
};
