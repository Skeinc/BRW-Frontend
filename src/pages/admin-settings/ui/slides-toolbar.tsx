import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ToolbarButton } from '@/shared/ui/toolbar-button';

interface SlidesToolbarProps {
  onCreate: () => void;
}

export function SlidesToolbar({ onCreate }: SlidesToolbarProps) {
  const { t } = useTranslation();
  return (
    <div className="flex justify-end">
      <ToolbarButton icon={Plus} label={t('admin.slides.create')} onClick={onCreate} />
    </div>
  );
}
