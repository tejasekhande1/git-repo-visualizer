import { Users, ExternalLink } from "lucide-react";
import type { Contributor } from "@/lib/api";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

interface ContributorsListProps {
    contributors: Contributor[];
}

export default function ContributorsList({ contributors }: ContributorsListProps) {
    const { t } = useTranslation();

    return (
        <div className="border border-border bg-background rounded-sm overflow-hidden flex flex-col h-full group">
            <div className="p-5 border-b border-border bg-secondary/30">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">{t("repository.activeAssets")}</h3>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-1 scrollbar-hide">
                <div className="space-y-0.5">
                    {contributors.map((contributor, index) => (
                        <div
                            key={index}
                            className="group/item flex items-center justify-between p-3 rounded-sm hover:bg-secondary transition-colors border-b border-border/10 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Image
                                        src={contributor.avatarUrl || `https://avatar.vercel.sh/${contributor.name}`}
                                        alt={contributor.name}
                                        width={32}
                                        height={32}
                                        className="h-8 w-8 rounded-sm grayscale border border-border group-hover/item:grayscale-0 transition-all"
                                        unoptimized
                                    />
                                </div>
                                <div>
                                    <h4 className="text-[12px] font-bold text-foreground group-hover/item:text-primary transition-colors">
                                        {contributor.name}
                                    </h4>
                                    <p className="text-[9px] font-mono font-bold text-muted-foreground/40 uppercase tracking-tighter">
                                        {t("repository.rank")}: {contributor.commits > 800 ? 'Elite' : 'Alpha'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[13px] font-black text-foreground">
                                    {contributor.commits.toLocaleString()}
                                </span>
                                <span className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-widest text-right">{t("repository.points")}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-border bg-secondary/50">
                <button className="w-full py-2 px-4 rounded border border-border bg-background hover:border-primary/30 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-2">
                    <ExternalLink className="h-3 w-3" />
                    {t("repository.expand")}
                </button>
            </div>
        </div>
    );
}
