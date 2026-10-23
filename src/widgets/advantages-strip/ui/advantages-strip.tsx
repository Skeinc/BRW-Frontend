import { CreditCard, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ADVANTAGES = [
  { key: 'delivery', icon: Truck },
  { key: 'warranty', icon: ShieldCheck },
  { key: 'installment', icon: CreditCard },
  { key: 'consultation', icon: MessageCircle },
] as const;

export function AdvantagesStrip() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto w-full max-w-7xl px-4">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ADVANTAGES.map(({ key, icon: Icon }) => (
          <li
            key={key}
            className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-card p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <span
              aria-hidden
              className="absolute -top-10 -right-10 size-32 rounded-full bg-primary/5 transition-transform duration-300 group-hover:scale-125"
            />
            <span className="relative flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
              <Icon aria-hidden className="size-7" strokeWidth={1.75} />
            </span>
            <div className="relative">
              <h3 className="text-lg font-bold tracking-tight">{t(`pages.home.advantages.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`pages.home.advantages.${key}.text`)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
