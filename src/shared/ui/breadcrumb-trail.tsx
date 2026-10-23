import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

export interface BreadcrumbStep {
  label: string;
  /** Where the step leads: the catalog index or a category. Omitted on the current page. */
  to?: 'catalog' | 'articles' | { categoryId: string };
}

interface BreadcrumbTrailProps {
  /** Steps after "Home"; the last one is the current page. */
  steps: readonly BreadcrumbStep[];
}

export function BreadcrumbTrail({ steps }: BreadcrumbTrailProps) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t('nav.breadcrumbs')} className="mb-6 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
        <li>
          <Link to="/" className="inline-flex min-h-6 items-center hover:text-primary">
            {t('nav.home')}
          </Link>
        </li>
        {steps.map((step, index) => {
          const isCurrent = index === steps.length - 1;
          return (
            <Fragment key={`${index}-${step.label}`}>
              <li aria-hidden>
                <ChevronRight className="size-4" />
              </li>
              {isCurrent || !step.to ? (
                <li aria-current={isCurrent ? 'page' : undefined} className="font-semibold text-foreground">
                  {step.label}
                </li>
              ) : (
                <li>
                  {step.to === 'catalog' || step.to === 'articles' ? (
                    <Link
                      to={step.to === 'catalog' ? '/catalog' : '/articles'}
                      className="inline-flex min-h-6 items-center hover:text-primary"
                    >
                      {step.label}
                    </Link>
                  ) : (
                    <Link
                      to="/catalog/$categoryId"
                      params={{ categoryId: step.to.categoryId }}
                      className="inline-flex min-h-6 items-center hover:text-primary"
                    >
                      {step.label}
                    </Link>
                  )}
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
