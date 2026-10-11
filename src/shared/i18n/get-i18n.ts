import { createInstance, type i18n as I18nInstance } from 'i18next';
import be from './locales/be.json';
import en from './locales/en.json';
import ru from './locales/ru.json';
import { DEFAULT_LANGUAGE, LANGUAGES, type Language } from './languages';

const RESOURCES = {
  ru: { translation: ru },
  en: { translation: en },
  be: { translation: be },
};

const instances = new Map<Language, I18nInstance>();

/**
 * One fixed-language instance per language, created once. Safe to share between concurrent SSR requests
 * because an instance never changes its language.
 */
export function getI18n(language: Language): I18nInstance {
  const cached = instances.get(language);
  if (cached) {
    return cached;
  }
  const instance = createInstance({
    resources: RESOURCES,
    lng: language,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...LANGUAGES],
    interpolation: { escapeValue: false },
    initAsync: false,
  });
  void instance.init();
  instances.set(language, instance);
  return instance;
}
