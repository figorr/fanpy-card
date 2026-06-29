import en from "./translations/en.json";
import es from "./translations/es.json";
import ca from "./translations/ca.json";

const TRANSLATIONS = { en, es, ca };

export function t(hass, key, fallback) {
  const lang = (hass && hass.language) || "en";
  const map = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return map[key] || fallback || TRANSLATIONS.en[key] || key;
}
