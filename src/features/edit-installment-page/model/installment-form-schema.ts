import { z } from 'zod';

const required = { error: 'admin.validation.required' };
const tooLong = { error: 'admin.validation.tooLong' };
const tooMany = { error: 'admin.validation.tooMany' };

export const CARDS_MAX = 12;
export const LOANS_MAX = 20;
export const BADGES_MAX = 8;
export const FACTS_MAX = 12;
export const DETAILS_MAX = 12;
export const STEPS_MAX = 20;

const shortText = z.string().trim().min(1, required).max(120, tooLong);
const longText = z.string().trim().min(1, required).max(1000, tooLong);
const labeledValue = z.object({ label: shortText, value: longText });

const cardSchema = z.object({
  note: shortText,
  name: shortText,
  months: z.number(required).int(required).min(1, required).max(600, tooLong),
  rate: shortText,
  payment: z.string().trim().max(120, tooLong),
});

const loanSchema = z.object({
  bank: shortText,
  name: shortText,
  badges: z.array(z.object({ text: shortText })).max(BADGES_MAX, tooMany),
  term: shortText,
  rate: longText,
  facts: z.array(labeledValue).max(FACTS_MAX, tooMany),
  details: z.array(labeledValue).max(DETAILS_MAX, tooMany),
  steps: z.array(z.object({ text: longText })).max(STEPS_MAX, tooMany),
});

export const installmentFormSchema = z.object({
  cards: z.array(cardSchema).min(1, required).max(CARDS_MAX, tooMany),
  loans: z.array(loanSchema).min(1, required).max(LOANS_MAX, tooMany),
});

export type InstallmentFormValues = z.infer<typeof installmentFormSchema>;
