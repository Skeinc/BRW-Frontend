import { useQuery } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { productsPageQueryOptions } from '@/entities/product';
import type { SolutionElement } from '@/entities/solution';
import { Button } from '@/shared/ui/button';
import { SearchInput } from '@/shared/ui/search-input';
import type { SolutionFormValues } from '../model/solution-form-schema';

const RESULTS_LIMIT = 20;

export function SolutionProductsField() {
  const { t } = useTranslation();
  const { control } = useFormContext<SolutionFormValues>();
  const collectionId = useWatch({ control, name: 'collectionId' });
  const [q, setQ] = useState('');
  const results = useQuery({
    ...productsPageQueryOptions({
      page: 1,
      pageSize: RESULTS_LIMIT,
      q: q.trim() || undefined,
      collectionId: collectionId || undefined,
    }),
    enabled: Boolean(collectionId),
  });

  return (
    <Controller
      control={control}
      name="products"
      render={({ field }) => {
        const chosen: SolutionElement[] = field.value;
        const chosenIds = new Set(chosen.map((item) => item.id));
        const candidates = (results.data?.items ?? []).filter((item) => !chosenIds.has(item.id));
        return (
          <div className="flex flex-col gap-4">
            {chosen.length > 0 ? (
              <ul className="flex flex-col divide-y rounded-lg border">
                {chosen.map((item) => (
                  <li key={item.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                    <span className="min-w-0 flex-1 truncate">{item.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t('admin.solutions.products.remove', { name: item.name })}
                      onClick={() => field.onChange(chosen.filter((other) => other.id !== item.id))}
                    >
                      <X aria-hidden />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t('admin.solutions.products.none')}</p>
            )}
            {collectionId ? (
              <div className="flex flex-col gap-2">
                <SearchInput value={q} onChange={setQ} placeholder={t('admin.solutions.products.search')} />
                {candidates.length > 0 ? (
                  <ul className="flex max-h-64 flex-col divide-y overflow-y-auto rounded-lg border">
                    {candidates.map((item) => (
                      <li key={item.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                        <span className="min-w-0 flex-1 truncate">{item.name}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => field.onChange([...chosen, { id: item.id, name: item.name }])}
                        >
                          <Plus aria-hidden />
                          {t('admin.solutions.products.add')}
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t(results.isPending ? 'admin.solutions.products.loading' : 'admin.solutions.products.noResults')}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t('admin.solutions.products.pickCollection')}</p>
            )}
          </div>
        );
      }}
    />
  );
}
