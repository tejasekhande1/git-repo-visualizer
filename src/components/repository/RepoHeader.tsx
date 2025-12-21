import { Github, Globe, Clock, Activity, Database, RefreshCw, Loader2 } from "lucide-react";
import type { Repository, GitStats } from "@/lib/api";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/components/ui/Button";

interface RepoHeaderProps {
    repo: Repository;
    stats: GitStats;
    onReindex?: () => void;
    isReindexing?: boolean;
}

export default function RepoHeader({ repo, stats, onReindex, isReindexing }: RepoHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="relative border border-border bg-background p-8 rounded-sm overflow-hidden group">
            {/* Precision Grid Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_0)] bg-[size:16px_16px] opacity-10 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-6">
                    <div className="h-16 w-16 rounded border border-border bg-secondary flex items-center justify-center shadow-sm group-hover:border-primary transition-colors duration-500">
                        <Github className="h-8 w-8 text-foreground" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
                                {repo.name}
                            </h1>
                            <div className="px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1.5 bg-emerald-500/5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{t("repository.activeLink")}</span>
                            </div>
                        </div>
                        <p className="text-muted-foreground text-xs font-medium max-w-2xl leading-relaxed">
                            {repo.description || "Experimental data structure analysis for this specified repository."}
                        </p>
                        
                        <div className="mt-5 flex flex-wrap gap-5 items-center">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                                <Globe className="h-3 w-3" />
                                <span>Ref: {String(repo.id).slice(0, 12)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                                <Clock className="h-3 w-3" />
                                <span>Synced: {new Date(repo.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            {onReindex && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onReindex}
                                    disabled={isReindexing}
                                    className="h-6 px-2 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-secondary border border-transparent hover:border-border"
                                >
                                    {isReindexing ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        <RefreshCw className="h-3 w-3" />
                                    )}
                                    {isReindexing ? "Indexing..." : "Re-Index"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform Status Bar */}
            <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5">
                        <Database className="h-3 w-3 text-primary" />
                        <span>Total commits processed: {stats.totalCommits.toLocaleString()}</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-border" />
                    <span>Kernel: V2.5-Precision</span>
                </div>
                <div className="flex items-center gap-2 text-primary font-black">
                    <Activity className="h-3 w-3 animate-pulse" />
                    {t("repository.status")}
                </div>
            </div>
        </div>
    );
}
