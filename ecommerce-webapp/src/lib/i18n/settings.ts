export const fallbackLng = "en";
export const languages = [fallbackLng, "zh-Hant"];
export const cookieName = "i18next";
export const defaultNS = "translation";

interface LocaleCodes {
  [key: string]: string;
}

export const localeCodes: LocaleCodes = languages.reduce((acc: LocaleCodes, lang: string) => {
  switch (lang) {
      case fallbackLng:
          acc[lang] = "English";
          break;
      case "zh-Hant":
          acc["zh-Hant"] = "繁體中文";
          break;
      default:
          break;
  }
  return acc;
}, {});

// lng = 採用的語言, ns = 採用的 name space
export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}