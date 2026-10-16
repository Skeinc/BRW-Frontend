import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

/** Red asterisk after the label of a required field; the tooltip explains it. */
export function RequiredMark() {
  const { t } = useTranslation();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          role="img"
          aria-label={t('admin.common.required')}
          className="ml-0.5 cursor-help rounded-sm text-destructive focus-visible:ring-2 focus-visible:ring-ring"
        >
          *
        </span>
      </TooltipTrigger>
      <TooltipContent>{t('admin.common.required')}</TooltipContent>
    </Tooltip>
  );
}
