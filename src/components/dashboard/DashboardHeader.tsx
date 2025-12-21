import { Search, Plus, Terminal, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";

interface DashboardHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onAddClick: () => void;
    onSyncClick: () => void;
}

export default function DashboardHeader({
    searchQuery,
    setSearchQuery,
    onAddClick,
    onSyncClick,
}: DashboardHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-8">
            <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
                    <Terminal className="h-3 w-3" />
                    <span>Analytical Hub / Active Sessions</span>
                </div>
                <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
                    {t("dashboard.title")}
                </h1>
                <p className="text-sm text-muted-foreground font-medium max-w-sm">
                    {t("dashboard.subtitle")}
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder={t("common.search")}
                        className="h-10 w-full rounded border border-border bg-background pl-9 pr-4 text-xs font-medium outline-none transition-all placeholder:text-muted-foreground/40 focus:border-foreground/20 focus:ring-1 focus:ring-foreground/10 sm:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Button variant="outline" size="md" onClick={onSyncClick} className="gap-2 rounded">
                    <RefreshCw className="h-4 w-4" />
                    {t("dashboard.sync")}
                </Button>
                <Button variant="default" size="md" onClick={onAddClick} className="gap-2 rounded">
                    <Plus className="h-4 w-4" />
                    {t("dashboard.addRepo")}
                </Button>
            </div>
        </div>
    );
}
