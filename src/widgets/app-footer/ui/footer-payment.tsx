import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

const PAYMENT_METHODS = ['paymentCash', 'halva', 'purchaseCard', 'turtle'] as const;

/** Ways to pay that the shop accepts today: cash and the installment cards. */
export function FooterPayment() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-background/15 py-6 text-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-background/60">{t('footer.payment')}</p>
      <ul className="flex flex-wrap gap-2">
        {PAYMENT_METHODS.map((method) => (
          <li key={method} className="rounded-full border border-background/25 px-3 py-1 text-xs font-medium">
            {method === 'paymentCash' ? t('footer.paymentCash') : t(`pages.installment.cards.items.${method}.name`)}
          </li>
        ))}
      </ul>
      <Link
        to="/delivery-and-payment"
        className="text-xs text-background/70 underline-offset-4 hover:text-primary hover:underline"
      >
        {t('footer.paymentMore')}
      </Link>
    </div>
  );
}
