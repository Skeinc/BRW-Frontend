import { z } from 'zod';

const required = { error: 'admin.validation.required' };
const tooLong = { error: 'admin.validation.tooLong' };
const tooMany = { error: 'admin.validation.tooMany' };

export const PAYMENT_CARDS_COUNT = 3;
export const DELIVERY_CARDS_COUNT = 3;
export const RECEIVING_STEPS_MAX = 12;
export const DOCUMENTS_MAX = 12;
export const FAQ_ITEMS_MAX = 30;

const cardSchema = z.object({
  title: z.string().trim().min(1, required).max(120, tooLong),
  text: z.string().trim().min(1, required).max(1000, tooLong),
});

const paymentCardSchema = cardSchema.extend({ enabled: z.boolean() });

export const deliveryFormSchema = z.object({
  payment: z.array(paymentCardSchema).length(PAYMENT_CARDS_COUNT),
  delivery: z.array(cardSchema).length(DELIVERY_CARDS_COUNT),
  receiving: z.array(cardSchema).min(1, required).max(RECEIVING_STEPS_MAX, tooMany),
  documents: z
    .array(z.object({ text: z.string().trim().min(1, required).max(300, tooLong) }))
    .min(1, required)
    .max(DOCUMENTS_MAX, tooMany),
  faq: z
    .array(
      z.object({
        question: z.string().trim().min(1, required).max(300, tooLong),
        answer: z.string().trim().min(1, required).max(2000, tooLong),
      }),
    )
    .max(FAQ_ITEMS_MAX, tooMany),
});

export type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;
