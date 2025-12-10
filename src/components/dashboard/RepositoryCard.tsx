import Link from "next/link";
import { motion } from "framer-motion";
import { GitFork, Star, ArrowRight, Github } from "lucide-react";
import type { Repository } from "@/lib/api";
import { cn } from "@/lib/utils";

interface RepositoryCardProps {
    repo: Repository;
    index: number;
}

export default function RepositoryCard({ repo, index }: RepositoryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Link href={`/repository/${repo.id}`} className="block h-full">
                <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-900 hover:shadow-lg dark:border-gray-800 dark:bg-zinc-900 dark:hover:border-zinc-500">
                    <div>
                        <div className="mb-4 flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <Github className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                <h3 className="line-clamp-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {repo.name}
                                </h3>
                            </div>
                            <motion.div
                                className="opacity-0 transition-opacity group-hover:opacity-100"
                                initial={{ x: -10 }}
                                whileHover={{ x: 0 }}
                            >
                                <ArrowRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </motion.div>
                        </div>

                        <p className="mb-6 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                            {repo.description || "No description available"}
                        </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4" />
                                <span>{repo.starCount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <GitFork className="h-4 w-4" />
                                <span>{repo.forkCount.toLocaleString()}</span>
                            </div>
                        </div>

                        <span className="text-xs text-gray-400">
                            {new Date(repo.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
