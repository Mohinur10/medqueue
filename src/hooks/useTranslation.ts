import { useMedQueue } from '../context/MedQueueContext';
import { dictionaries } from '../i18n/dictionaries';

export function useTranslation() {
  const { activeLanguage } = useMedQueue();

  // Fallback to English if the language key somehow is missing
  const dict = dictionaries[activeLanguage] || dictionaries.en;

  return {
    t: dict,
    activeLanguage
  };
}
