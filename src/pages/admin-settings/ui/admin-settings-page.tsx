import type { SettingsSearch } from '../model/settings-search';
import { SliderTab } from './slider-tab';

interface AdminSettingsPageProps {
  search: SettingsSearch;
  onSearchChange: (patch: Partial<SettingsSearch>) => void;
}

export function AdminSettingsPage({ search, onSearchChange }: AdminSettingsPageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SliderTab search={search} onSearchChange={onSearchChange} />
    </div>
  );
}
