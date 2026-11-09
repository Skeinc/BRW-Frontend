/** A card with a title and a text. */
export interface DeliveryPageCard {
  title: string;
  text: string;
}

/** `enabled: false` hides the card on the public page; missing means shown. */
export interface DeliveryPagePaymentCard extends DeliveryPageCard {
  enabled?: boolean;
}

export interface DeliveryPageFaqItem {
  question: string;
  answer: string;
}

/** Editable blocks of the "Delivery and payment" page (Russian). */
export interface DeliveryPageContent {
  payment: DeliveryPagePaymentCard[];
  delivery: DeliveryPageCard[];
  receiving: DeliveryPageCard[];
  documents: string[];
  faq: DeliveryPageFaqItem[];
}

/** `content` is null until the first save in the admin panel. */
export interface DeliveryPageResponse {
  content: DeliveryPageContent | null;
}
