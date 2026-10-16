import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/utils';
import { Badge } from './badge';

interface PublicationBadgeProps {
  isPublished: boolean;
}

/** "Published" in green and "Draft" in grey: the state of a record at a glance. */
export function PublicationBadge({ isPublished }: PublicationBadgeProps) {
  const { t } = useTranslation();
  return (
    <Badge variant="secondary" className={cn(isPublished && 'bg-emerald-100 text-emerald-800')}>
      {t(isPublished ? 'ui.editor.published' : 'ui.editor.draft')}
    </Badge>
  );
}
