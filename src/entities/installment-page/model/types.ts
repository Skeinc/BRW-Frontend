/** An installment card (Halva, Turtle...). `payment` is empty when the card has no payment day. */
export interface InstallmentPageCard {
  note: string;
  name: string;
  months: number;
  rate: string;
  payment: string;
}

/** A line of a loan card: a grey label and its value. */
export interface InstallmentPageLabeledValue {
  label: string;
  value: string;
}

/** A bank loan or installment offer. */
export interface InstallmentPageLoan {
  bank: string;
  name: string;
  badges: string[];
  term: string;
  rate: string;
  facts: InstallmentPageLabeledValue[];
  details: InstallmentPageLabeledValue[];
  steps: string[];
}

/** Editable blocks of the "Installment" page. */
export interface InstallmentPageContent {
  cards: InstallmentPageCard[];
  loans: InstallmentPageLoan[];
}

/** `content` is null until the first save in the admin panel. */
export interface InstallmentPageResponse {
  content: InstallmentPageContent | null;
}
