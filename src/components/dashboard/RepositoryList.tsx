import { motion, LayoutGroup } from "framer-motion";
import { Database } from "lucide-react";
import RepositoryCard from "./RepositoryCard";
import type { Repository } from "@/lib/api";

interface RepositoryListProps {
    repositories: Repository[];
    isLoading: boolean;
}

export default function RepositoryList({ repositories, isLoading }: RepositoryListProps) {
    if (isLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="h-52 animate-pulse rounded-2xl border border-border/20 bg-muted/20"
                    >
                        <div className="h-full w-full bg-gradient-to-br from-transparent via-white/5 to-transparent animate-shimmer" />
                    </div>
                ))}
            </div>
        );
    }

    if (repositories.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-32 text-center glass rounded-3xl border-dashed border-2 border-border/20 mx-4"
            >
                <div className="mb-6 rounded-2xl bg-primary/10 p-5 ring-1 ring-primary/20">
                    <Database className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    Analytical Void Detected
                </h3>
                <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
                    The platform engine currently has no active data streams. Provision a repository URL to begin deep-dive visualization.
                </p>
                <div className="mt-8 flex items-center gap-2 text-xs font-mono text-muted-foreground/50">
                    <span className="h-2 w-2 rounded-full bg-destructive/50" />
                    SYSTEM_IDLE: Awaiting repository ingestion...
                </div>
            </motion.div>
        );
    }

    return (
        <LayoutGroup>
            <motion.div
                layout
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                {repositories.map((repo, index) => (
                    <RepositoryCard key={repo.id} repo={repo} index={index} />
                ))}
            </motion.div>
        </LayoutGroup>
    );
}
