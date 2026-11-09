import { translate, type Language } from '@/shared/i18n';
import {
  DEFAULT_DELIVERY_IDS,
  DEFAULT_DOCUMENT_IDS,
  DEFAULT_FAQ_IDS,
  DEFAULT_PAYMENT_IDS,
  DEFAULT_RECEIVING_IDS,
} from '../model/default-ids';
import type { DeliveryPageCard, DeliveryPageContent } from '../model/types';

const BASE = 'pages.deliveryAndPayment';

function readCards(language: Language, group: string, ids: readonly string[]): DeliveryPageCard[] {
  return ids.map((id) => ({
    title: translate(language, `${BASE}.${group}.${id}.title`),
    text: translate(language, `${BASE}.${group}.${id}.text`),
  }));
}

/** The texts built into the locale files. */
export function buildDefaultDeliveryContent(language: Language): DeliveryPageContent {
  return {
    payment: readCards(language, 'payment', DEFAULT_PAYMENT_IDS),
    delivery: readCards(language, 'delivery', DEFAULT_DELIVERY_IDS),
    receiving: DEFAULT_RECEIVING_IDS.map((id) => ({
      title: translate(language, `${BASE}.receiving.steps.${id}.title`),
      text: translate(language, `${BASE}.receiving.steps.${id}.text`),
    })),
    documents: DEFAULT_DOCUMENT_IDS.map((id) => translate(language, `${BASE}.documents.items.${id}`)),
    faq: DEFAULT_FAQ_IDS.map((id) => ({
      question: translate(language, `${BASE}.faq.items.${id}.q`),
      answer: translate(language, `${BASE}.faq.items.${id}.a`),
    })),
  };
}

interface ResolveDeliveryContentInput {
  /** What the API returned; null until the first save. */
  saved: DeliveryPageContent | null | undefined;
  language: Language;
}

/** Saved content in every language as it was written; the built-in translations until the first save. */
export function resolveDeliveryContent({ saved, language }: ResolveDeliveryContentInput): DeliveryPageContent {
  return saved ?? buildDefaultDeliveryContent(language);
}
