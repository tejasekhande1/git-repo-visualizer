import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export type Locale = "en" | "mr";

interface LocaleState {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
    devtools(
        persist(
            (set) => ({
                locale: "en",
                setLocale: (locale) => set({ locale }),
            }),
            {
                name: "git-visualizer-locale",
            }
        )
    )
);
