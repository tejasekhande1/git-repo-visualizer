import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Hash, Lock, Globe, GitBranch, Clock } from "lucide-react";
import type { Repository } from "@/lib/api";
import { useTranslation } from "@/hooks/useTranslation";
import { formatDate } from "@/lib/utils";

interface RepositoryCardProps {
    repo: Repository;
    index: number;
}

export default function RepositoryCard({ repo, index }: RepositoryCardProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Link href={`/repository/${repo.id}`} className="block group">
                <div className="relative flex flex-col justify-between overflow-hidden border border-border bg-background p-5 transition-all hover:border-foreground/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-sm">
                    {/* Index Marker */}
                    <div className="absolute right-0 top-0 p-2 text-[8px] font-mono text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity">
                        REF:0x{String(repo.id).slice(0, 4).toUpperCase()}
                    </div>

                    <div>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border bg-secondary group-hover:bg-foreground group-hover:text-background transition-colors">
                                <Github className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-bold tracking-tight text-foreground uppercase group-hover:text-primary transition-colors truncate">
                                    {repo.name || "Unnamed Repository"}
                                </h3>
                                <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-muted-foreground/60 uppercase">
                                    <Hash className="h-2 w-2" />
                                    <span>{t("dashboard.id")}: {String(repo.id).slice(0, 8)}</span>
                                </div>
                            </div>
                        </div>

                        <p className="mb-6 line-clamp-2 text-xs leading-relaxed text-muted-foreground font-medium">
                            {repo.description || "Experimental data structure analysis for this specified repository."}
                        </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/50 pt-4">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                                {repo.isPrivate ? (
                                    <Lock className="h-3 w-3 text-amber-500" />
                                ) : (
                                    <Globe className="h-3 w-3 text-sky-500" />
                                )}
                                <span>{repo.isPrivate ? "Private" : "Public"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                                <GitBranch className="h-3 w-3 text-violet-500" />
                                <span>{repo.defaultBranch}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                                <Clock className="h-3 w-3 text-emerald-500" />
                                <span>{formatDate(new Date(repo.updatedAt))}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                             <span className="text-[9px] font-mono font-black text-muted-foreground/40 uppercase tracking-tighter">{t("common.verified")}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
