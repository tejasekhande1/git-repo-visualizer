"use client";

import { useState, useEffect, use } from "react";
import { Header } from "@/components/layout";
import {
    RepoHeader,
    ContributorsList,
    ContributionHeatmap,
    ActivityChart,
} from "@/components/repository";
import { api, type Repository, type GitStats } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function RepositoryPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [repo, setRepo] = useState<Repository | null>(null);
    const [stats, setStats] = useState<GitStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRepoDetails();
    }, []);

    const loadRepoDetails = async () => {
        try {
            setIsLoading(true);
            const [repoData, statsData] = await Promise.all([
                api.getRepository(resolvedParams.id),
                api.getRepositoryStats(resolvedParams.id),
            ]);

            if (repoData) {
                setRepo(repoData);
                setStats(statsData);
            }
        } catch (error) {
            console.error("Failed to load repository details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
                <Header />
                <main className="flex flex-1 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </main>
            </div>
        );
    }

    if (!repo || !stats) {
        return (
            <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
                <Header />
                <main className="flex flex-1 items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Repository Not Found
                        </h1>
                        <p className="mt-2 text-gray-500">
                            The repository you are looking for does not exist.
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
            <Header />

            <main className="flex-1">
                <div className="container mx-auto max-w-7xl px-4 py-8">
                    <RepoHeader repo={repo} stats={stats} />

                    <div className="mt-8 grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <ContributionHeatmap activity={stats.activity} />
                            <ActivityChart activity={stats.activity} />
                        </div>

                        <div>
                            <ContributorsList contributors={stats.contributors} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
