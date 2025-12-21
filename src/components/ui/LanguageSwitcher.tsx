"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
    const { locale, setLocale } = useTranslation();

    return (
        <div className="flex items-center gap-1 rounded border border-border bg-secondary/30 p-0.5">
            <button
                onClick={() => setLocale("en")}
                className={cn(
                    "px-2 py-1 text-[9px] font-black uppercase tracking-tighter transition-all rounded-sm",
                    locale === "en" 
                        ? "bg-foreground text-background" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
            >
                EN
            </button>
            <button
                onClick={() => setLocale("mr")}
                className={cn(
                    "px-2 py-1 text-[9px] font-black uppercase tracking-tighter transition-all rounded-sm",
                    locale === "mr" 
                        ? "bg-foreground text-background" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
            >
                मराठी
            </button>
        </div>
    );
}
