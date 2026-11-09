export type CardId = 'halva' | 'purchaseCard' | 'turtle';

export interface CardOffer {
  id: CardId;
  months: number;
  rate: 'zero' | 'ask';
  payDay: number | null;
}

export const CARD_OFFERS: readonly CardOffer[] = [
  { id: 'halva', months: 2, rate: 'zero', payDay: 15 },
  { id: 'purchaseCard', months: 3, rate: 'zero', payDay: null },
  { id: 'turtle', months: 8, rate: 'ask', payDay: 25 },
];

export type LoanId =
  'sberInstallment' | 'sberGrace' | 'sberCredit' | 'belarusbankNative' | 'belarusbankPartner' | 'priorbank' | 'bsb';

export type FactId = 'amount' | 'payment' | 'deferral' | 'disbursement' | 'interest' | 'applying';
export type BadgeId =
  'domesticGoods' | 'noDownPayment' | 'noIncomeProof' | 'noGuarantors' | 'noInsurance' | 'noPurposeCheck';
export type DetailId = 'documents' | 'citizenship' | 'age' | 'military' | 'income';

export interface LoanOffer {
  id: LoanId;
  facts: readonly FactId[];
  badges: readonly BadgeId[];
  details: readonly DetailId[];
  stepCount: number;
}

export const LOAN_OFFERS: readonly LoanOffer[] = [
  {
    id: 'sberInstallment',
    facts: ['amount'],
    badges: ['domesticGoods', 'noIncomeProof'],
    details: [],
    stepCount: 0,
  },
  {
    id: 'sberGrace',
    facts: ['amount', 'payment'],
    badges: ['domesticGoods', 'noIncomeProof'],
    details: [],
    stepCount: 0,
  },
  {
    id: 'sberCredit',
    facts: ['amount', 'payment'],
    badges: ['domesticGoods', 'noIncomeProof'],
    details: [],
    stepCount: 0,
  },
  {
    id: 'belarusbankNative',
    facts: ['amount', 'payment', 'disbursement', 'interest'],
    badges: ['domesticGoods', 'noDownPayment', 'noGuarantors', 'noInsurance'],
    details: ['income'],
    stepCount: 4,
  },
  {
    id: 'belarusbankPartner',
    facts: ['payment', 'deferral'],
    badges: ['noDownPayment', 'noGuarantors', 'noInsurance'],
    details: ['documents', 'citizenship', 'age', 'military'],
    stepCount: 0,
  },
  {
    id: 'priorbank',
    facts: ['amount', 'applying', 'disbursement'],
    badges: ['domesticGoods'],
    details: [],
    stepCount: 0,
  },
  {
    id: 'bsb',
    facts: ['disbursement'],
    badges: ['domesticGoods', 'noGuarantors', 'noPurposeCheck'],
    details: [],
    stepCount: 4,
  },
];
