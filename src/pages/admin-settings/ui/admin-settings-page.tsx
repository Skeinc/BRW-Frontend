import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import type { SettingsSearch } from '../model/settings-search';
import { SliderTab } from './slider-tab';

interface AdminSettingsPageProps {
  search: SettingsSearch;
  onSearchChange: (patch: Partial<SettingsSearch>) => void;
}

export function AdminSettingsPage({ search, onSearchChange }: AdminSettingsPageProps) {
  const { t } = useTranslation();
  return (
    <Tabs
      value={search.tab ?? 'slider'}
      onValueChange={(tab) => onSearchChange({ tab: tab as 'slider', page: undefined, edit: undefined })}
      className="min-h-0 flex-1"
    >
      <TabsList variant="line" aria-label={t('admin.settings.title')}>
        <TabsTrigger value="slider">{t('admin.settings.tabs.slider')}</TabsTrigger>
      </TabsList>
      <TabsContent value="slider" className="flex min-h-0 flex-1 flex-col">
        <SliderTab search={search} onSearchChange={onSearchChange} />
      </TabsContent>
    </Tabs>
  );
}
