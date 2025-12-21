"use client";

import { useLocaleStore } from "../lib/i18n/store";
import en from "../lib/i18n/dictionaries/en.json";
import mr from "../lib/i18n/dictionaries/mr.json";

const dictionaries: Record<string, any> = {
    en,
    mr,
};

export function useTranslation() {
    const { locale } = useLocaleStore();
    
    // Helper to get nested properties by string path (e.g. "auth.access")
    const t = (path: string) => {
        const keys = path.split(".");
        let result = dictionaries[locale];
        
        for (const key of keys) {
            if (result && result[key]) {
                result = result[key];
            } else {
                return path; // Fallback to path if not found
            }
        }
        
        return result as string;
    };

    return { t, locale, setLocale: useLocaleStore.getState().setLocale };
}
