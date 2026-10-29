import { useTranslation } from 'react-i18next';
import { ContactCta } from '@/widgets/contact-cta';
import { PageBreadcrumbs } from '@/shared/ui/page-breadcrumbs';
import type { FaqGroup } from '../model/faq-content';
import { FaqGroupNav } from './faq-group-nav';
import { FaqGroupSection } from './faq-group-section';

export function FaqPage() {
  const { t } = useTranslation();
  const groups = t('pages.faq.groups', { returnObjects: true }) as FaqGroup[];
  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 pb-12 pt-12 md:pb-16 md:pt-16">
        <PageBreadcrumbs current={t('pages.faq.heading')} />
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{t('pages.faq.heading')}</h1>
        <p className="mt-6 max-w-3xl text-lg text-muted-foreground">{t('pages.faq.lead')}</p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12">
          <FaqGroupNav groups={groups} />
          <div className="min-w-0 max-w-3xl space-y-10">
            {groups.map((group, groupIndex) => (
              <FaqGroupSection key={group.id} group={group} defaultOpen={groupIndex === 0 ? [`${group.id}-0`] : []} />
            ))}
          </div>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
