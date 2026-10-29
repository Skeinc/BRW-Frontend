import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ToolbarButton } from '@/shared/ui/toolbar-button';

interface RoomsToolbarProps {
  onCreate: () => void;
}

export function RoomsToolbar({ onCreate }: RoomsToolbarProps) {
  const { t } = useTranslation();
  return (
    <div className="flex justify-end">
      <ToolbarButton icon={Plus} label={t('admin.rooms.create')} onClick={onCreate} />
    </div>
  );
}
