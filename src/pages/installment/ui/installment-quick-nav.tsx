import { Link } from '@tanstack/react-router';
import { ArrowDown, Landmark, WalletCards } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TARGETS = [
  { id: 'cards', icon: WalletCards },
  { id: 'loans', icon: Landmark },
] as const;

export function InstallmentQuickNav() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-12 md:pb-16">
      <ul className="grid gap-4 md:grid-cols-2">
        {TARGETS.map(({ id, icon: Icon }) => (
          <li key={id}>
            <Link
              to="/installment"
              hash={id}
              hashScrollIntoView={{ behavior: 'smooth', block: 'start' }}
              className="group flex min-h-20 items-center gap-4 rounded-xl border bg-card p-5 transition-colors hover:border-primary sm:p-6"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon aria-hidden className="size-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-semibold">{t(`pages.installment.quickNav.${id}.title`)}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {t(`pages.installment.quickNav.${id}.text`)}
                </span>
              </span>
              <ArrowDown aria-hidden className="size-5 shrink-0 text-muted-foreground group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
