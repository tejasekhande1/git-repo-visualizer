import Link from "next/link";
import { ArrowLeft, Star, GitFork, Calendar, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import type { Repository, GitStats } from "@/lib/api";

interface RepoHeaderProps {
    repo: Repository;
    stats: GitStats;
}

export default function RepoHeader({ repo, stats }: RepoHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <Link
                href="/"
                className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </Link>

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        {repo.name}
                    </h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                        {repo.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            <span>{repo.starCount?.toLocaleString() ?? 0} stars</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <GitFork className="h-4 w-4" />
                            <span>{repo.forkCount?.toLocaleString() ?? 0} forks</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created {new Date(repo.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Link href={repo.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2 hover:text-black">
                            <ExternalLink className="h-4 w-4" />
                            View on GitHub
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
