import { useRouter } from '@tanstack/react-router';
import { Check, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { isLanguage, LANGUAGES, saveLanguage, type Language } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const current: Language = isLanguage(i18n.language) ? i18n.language : 'ru';
  const handleSelect = (language: Language): void => {
    saveLanguage(language);
    void router.invalidate();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-12 shrink-0 gap-1.5 px-2 uppercase sm:px-3"
          aria-label={t('language.label')}
        >
          <Globe aria-hidden />
          {current}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((language) => (
          <DropdownMenuItem key={language} onSelect={() => handleSelect(language)} className="min-h-10 gap-2">
            {t(`language.${language}`)}
            {language === current && <Check className="ml-auto" aria-hidden />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
