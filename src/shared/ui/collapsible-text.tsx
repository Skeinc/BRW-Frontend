import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/utils';
import { Button } from './button';

interface CollapsibleTextProps {
  text: string;
  className?: string;
}

/** Long copy that is clipped on phones behind a "read more" button and shown in full from `md` up. */
export function CollapsibleText({ text, className }: CollapsibleTextProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={className}>
      <div className={cn('whitespace-pre-line text-muted-foreground', !isOpen && 'line-clamp-4 md:line-clamp-none')}>
        {text}
      </div>
      <Button variant="link" className="h-11 px-0 md:hidden" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? t('common.collapse') : t('common.readMore')}
      </Button>
    </div>
  );
}
