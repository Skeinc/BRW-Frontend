import { FileSignature, FileText, Receipt, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageSection } from '@/shared/ui/page-section';

const DOCUMENTS = [
  { key: 'receipt', icon: Receipt },
  { key: 'waybill', icon: Truck },
  { key: 'contract', icon: FileSignature },
  { key: 'act', icon: FileText },
] as const;

export function DocumentsList() {
  const { t } = useTranslation();
  const base = 'pages.deliveryAndPayment.documents';
  return (
    <PageSection id="documents" heading={t(`${base}.heading`)} lead={t(`${base}.lead`)}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DOCUMENTS.map(({ key, icon: Icon }) => (
          <li key={key} className="flex items-start gap-4 rounded-xl border bg-card p-5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon aria-hidden className="size-5" />
            </span>
            <span className="font-semibold">{t(`${base}.items.${key}`)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 max-w-3xl text-muted-foreground">{t(`${base}.completion`)}</p>
      <p className="mt-2 max-w-3xl font-semibold">{t(`${base}.pickupDeadline`)}</p>
    </PageSection>
  );
}
