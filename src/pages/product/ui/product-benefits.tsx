import { CreditCard, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BENEFITS = [
  { key: 'delivery', icon: Truck },
  { key: 'warranty', icon: ShieldCheck },
  { key: 'installment', icon: CreditCard },
  { key: 'assembly', icon: Wrench },
] as const;

export function ProductBenefits() {
  const { t } = useTranslation();
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {BENEFITS.map(({ key, icon: Icon }) => (
        <li key={key} className="flex gap-3 rounded-xl border bg-card p-3">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
          >
            <Icon className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">{t(`product.benefits.${key}.title`)}</p>
            <p className="text-xs text-muted-foreground">{t(`product.benefits.${key}.text`)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
