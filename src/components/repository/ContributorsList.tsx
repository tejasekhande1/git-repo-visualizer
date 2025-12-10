import { motion } from "framer-motion";
import type { Contributor } from "@/lib/api";
import { User } from "lucide-react";

interface ContributorsListProps {
    contributors: Contributor[];
}

export default function ContributorsList({ contributors }: ContributorsListProps) {
    return (
        <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Top Contributors
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {contributors.map((contributor, index) => (
                    <motion.div
                        key={contributor.email}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-zinc-900"
                    >
                        <div className="flex h-10 w-10 min-w-[2.5rem] items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
                            {contributor.avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={contributor.avatarUrl}
                                    alt={contributor.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            ) : (
                                <User className="h-5 w-5 text-gray-500" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate font-medium text-gray-900 dark:text-gray-100">
                                {contributor.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {contributor.commits} commits
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
