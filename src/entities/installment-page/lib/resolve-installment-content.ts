import { translate, type Language } from '@/shared/i18n';
import { CARD_OFFERS, LOAN_OFFERS } from '../model/default-offers';
import type { InstallmentPageCard, InstallmentPageContent, InstallmentPageLoan } from '../model/types';

const BASE = 'pages.installment';

function buildDefaultCards(language: Language): InstallmentPageCard[] {
  const base = `${BASE}.cards`;
  return CARD_OFFERS.map((offer) => ({
    note: translate(language, `${base}.items.${offer.id}.note`),
    name: translate(language, `${base}.items.${offer.id}.name`),
    months: offer.months,
    rate: translate(language, `${base}.rates.${offer.rate}`),
    payment: offer.payDay === null ? '' : translate(language, `${base}.payDay`, { day: offer.payDay }),
  }));
}

function buildDefaultLoans(language: Language): InstallmentPageLoan[] {
  const base = `${BASE}.loans`;
  return LOAN_OFFERS.map((offer) => {
    const item = `${base}.items.${offer.id}`;
    return {
      bank: translate(language, `${item}.bank`),
      name: translate(language, `${item}.name`),
      badges: offer.badges.map((badge) => translate(language, `${base}.badges.${badge}`)),
      term: translate(language, `${item}.term`),
      rate: translate(language, `${item}.rate`),
      facts: offer.facts.map((fact) => ({
        label: translate(language, `${base}.facts.${fact}`),
        value: translate(language, `${item}.facts.${fact}`),
      })),
      details: offer.details.map((detail) => ({
        label: translate(language, `${base}.detailLabels.${detail}`),
        value: translate(language, `${item}.details.${detail}`),
      })),
      steps: Array.from({ length: offer.stepCount }, (_, index) => translate(language, `${item}.steps.${index + 1}`)),
    };
  });
}

/** The texts built into the locale files. */
export function buildDefaultInstallmentContent(language: Language): InstallmentPageContent {
  return { cards: buildDefaultCards(language), loans: buildDefaultLoans(language) };
}

interface ResolveInstallmentContentInput {
  /** What the API returned; null until the first save. */
  saved: InstallmentPageContent | null | undefined;
  language: Language;
}

/** Saved content in every language as it was written; the built-in translations until the first save. */
export function resolveInstallmentContent({ saved, language }: ResolveInstallmentContentInput): InstallmentPageContent {
  return saved ?? buildDefaultInstallmentContent(language);
}
