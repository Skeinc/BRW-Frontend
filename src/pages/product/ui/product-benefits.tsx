import { Link } from '@tanstack/react-router';
import { Banknote, CreditCard, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BENEFITS = [
  { key: 'delivery', icon: Truck, to: '/delivery-and-payment' },
  { key: 'payment', icon: Banknote, to: '/delivery-and-payment' },
  { key: 'installment', icon: CreditCard, to: '/installment' },
] as const;

export function ProductBenefits() {
  const { t } = useTranslation();
  return (
    <ul className="flex flex-col gap-3">
      {BENEFITS.map((benefit) => {
        const { key, icon: Icon } = benefit;
        return (
          <li key={key} className="flex gap-3 text-sm">
            <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
            <p className="min-w-0">
              <span className="font-semibold">{t(`product.benefits.${key}.title`)}</span>{' '}
              <span className="text-muted-foreground">{t(`product.benefits.${key}.text`)}</span>
              {'to' in benefit && (
                <>
                  {' '}
                  <Link to={benefit.to} className="text-primary underline-offset-2 hover:underline">
                    {t('product.benefits.more')}
                  </Link>
                </>
              )}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
