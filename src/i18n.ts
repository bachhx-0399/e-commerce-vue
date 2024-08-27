import { createI18n } from "vue-i18n";

// import translations
import vi from "./locales/vi.json";
import en from "./locales/en.json";

// configure i18n
const i18n = createI18n({
  legacy: false,
  locale: "vi",
  fallbackLocale: "en",
  messages: { vi , en },
});

export default i18n;
