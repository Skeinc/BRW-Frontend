import { useQuery } from '@tanstack/react-query';
import { ArrowUp, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { collectionOptionsQueryOptions } from '@/entities/collection';
import { Button } from '@/shared/ui/button';
import { SearchInput } from '@/shared/ui/search-input';
import { Switch } from '@/shared/ui/switch';
import type { RoomFormValues } from '../model/room-form-schema';

/** Moves the id one place up; the first one stays where it is. */
function moveUp(ids: readonly string[], index: number): string[] {
  const next = [...ids];
  [next[index - 1], next[index]] = [next[index], next[index - 1]];
  return next;
}

/** The consultation-only switch and, when it is on, the ordered collections the room shows. */
export function RoomCollectionsFields() {
  const { t } = useTranslation();
  const { control } = useFormContext<RoomFormValues>();
  const isConsultationOnly = useWatch({ control, name: 'isConsultationOnly' });
  const options = useQuery({ ...collectionOptionsQueryOptions, enabled: isConsultationOnly });
  const [q, setQ] = useState('');
  const names = new Map((options.data ?? []).map((option) => [option.id, option.name]));
  const base = 'admin.rooms.collections';

  return (
    <>
      <Controller
        control={control}
        name="isConsultationOnly"
        render={({ field }) => (
          <label
            htmlFor="room-consultation"
            className="flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors"
          >
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="font-medium">{t('admin.rooms.fields.consultation')}</span>
              <span className="text-sm text-muted-foreground">{t('admin.rooms.fields.consultationText')}</span>
            </span>
            <Switch id="room-consultation" checked={field.value} onCheckedChange={field.onChange} />
          </label>
        )}
      />
      {isConsultationOnly && (
        <Controller
          control={control}
          name="collectionIds"
          render={({ field }) => {
            const chosen: string[] = field.value;
            const needle = q.trim().toLocaleLowerCase();
            const candidates = (options.data ?? []).filter(
              (option) => !chosen.includes(option.id) && option.name.toLocaleLowerCase().includes(needle),
            );
            return (
              <div className="flex flex-col gap-4">
                {chosen.length > 0 ? (
                  <ol className="flex flex-col divide-y rounded-lg border">
                    {chosen.map((id, index) => {
                      const name = names.get(id) ?? '…';
                      return (
                        <li key={id} className="flex items-center gap-2 px-3 py-2 text-sm">
                          <span className="w-6 text-muted-foreground tabular-nums">{index + 1}</span>
                          <span className="min-w-0 flex-1 truncate">{name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={index === 0}
                            aria-label={t(`${base}.moveUp`, { name })}
                            onClick={() => field.onChange(moveUp(chosen, index))}
                          >
                            <ArrowUp aria-hidden />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={t(`${base}.remove`, { name })}
                            onClick={() => field.onChange(chosen.filter((other) => other !== id))}
                          >
                            <X aria-hidden />
                          </Button>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <p className="text-sm text-muted-foreground">{t(`${base}.none`)}</p>
                )}
                <div className="flex flex-col gap-2">
                  <SearchInput value={q} onChange={setQ} placeholder={t(`${base}.search`)} />
                  {candidates.length > 0 ? (
                    <ul className="flex max-h-64 flex-col divide-y overflow-y-auto rounded-lg border">
                      {candidates.map((option) => (
                        <li key={option.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                          <span className="min-w-0 flex-1 truncate">{option.name}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => field.onChange([...chosen, option.id])}
                          >
                            <Plus aria-hidden />
                            {t(`${base}.add`)}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {t(options.isPending ? `${base}.loading` : `${base}.noResults`)}
                    </p>
                  )}
                </div>
              </div>
            );
          }}
        />
      )}
    </>
  );
}
