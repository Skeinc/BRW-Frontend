import { useTranslation } from 'react-i18next';
import { MarkdownContent } from '@/shared/ui/markdown-content';
import { PageBreadcrumbs } from '@/shared/ui/page-breadcrumbs';

interface PrivacySection {
  title: string;
  body: string;
}

export function PrivacyPage() {
  const { t } = useTranslation();
  const sections = t('pages.privacy.sections', { returnObjects: true }) as PrivacySection[];
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-12 pt-12 md:pb-16 md:pt-16">
      <PageBreadcrumbs current={t('pages.privacy.heading')} />
      <h1 className="max-w-4xl text-3xl font-bold tracking-tight md:text-5xl">{t('pages.privacy.heading')}</h1>
      <p className="mt-6 max-w-3xl text-lg text-muted-foreground">{t('pages.privacy.lead')}</p>
      <div className="mt-10 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12">
        <nav aria-label={t('pages.privacy.navLabel')} className="lg:sticky lg:top-40 lg:self-start">
          <ol className="flex flex-col gap-1 text-sm">
            {sections.map((section, index) => (
              <li key={section.title}>
                <a
                  href={`#section-${index + 1}`}
                  className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <span className="tabular-nums font-semibold text-primary">{index + 1}</span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="min-w-0 max-w-3xl space-y-10">
          {sections.map((section, index) => (
            <section key={section.title} id={`section-${index + 1}`} className="scroll-mt-40">
              <h2 className="text-xl font-bold tracking-tight md:text-2xl">
                {index + 1}. {section.title}
              </h2>
              <div className="mt-3 text-sm text-muted-foreground md:text-base [&_strong]:font-semibold [&_strong]:text-foreground">
                <MarkdownContent content={section.body} />
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
