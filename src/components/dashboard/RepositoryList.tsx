import { motion, LayoutGroup } from "framer-motion";
import { GitBranch } from "lucide-react";
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
                        className="h-48 animate-pulse rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-zinc-900/50"
                    />
                ))}
            </div>
        );
    }

    if (repositories.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
            >
                <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-zinc-900">
                    <GitBranch className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    No repositories found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Get started by adding a new repository to visualize.
                </p>
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
