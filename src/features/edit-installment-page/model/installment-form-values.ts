import type { InstallmentPageContent } from '@/entities/installment-page';
import type { InstallmentFormValues } from './installment-form-schema';

export function toDefaultValues(content: InstallmentPageContent): InstallmentFormValues {
  return {
    cards: content.cards,
    loans: content.loans.map((loan) => ({
      ...loan,
      badges: loan.badges.map((text) => ({ text })),
      steps: loan.steps.map((text) => ({ text })),
    })),
  };
}

export function toInput(values: InstallmentFormValues): InstallmentPageContent {
  return {
    cards: values.cards,
    loans: values.loans.map((loan) => ({
      ...loan,
      badges: loan.badges.map((badge) => badge.text),
      steps: loan.steps.map((step) => step.text),
    })),
  };
}
