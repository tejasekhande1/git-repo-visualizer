"use client";

import { use, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout";
import Button from "@/components/ui/Button";
import {
    RepoHeader,
    ContributionHeatmap,
    ActivityChart,
    ChurnChart,
    BusFactorChart,
} from "@/components/repository";
import { useRepository, useIndexRepository, useRepositoryStats, useRepositoryStatus } from "@/hooks/useRepositories";
import Link from "next/link";
import { Loader2, AlertCircle, Cpu, Database, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function RepositoryPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const { data: repo, isLoading: isRepoLoading } = useRepository(resolvedParams.id);
    
    // Track if user triggered re-index (using ref to avoid cascading renders)
    const userTriggeredReindexRef = useRef(false);
    
    // Poll for status
    const { data: statusData } = useRepositoryStatus(resolvedParams.id, repo?.status);
    const currentStatus = statusData?.status || repo?.status;
    
    const indexMutation = useIndexRepository();

    // Determine if currently re-indexing based on status or mutation state
    const isActivelyIndexing = currentStatus === 'indexing' || currentStatus === 'pending';
    
    // Fetch stats only when status is explicitly 'completed' and not mutating
    const shouldFetchStats = statusData?.status === 'completed' && !indexMutation.isPending;
    const { data: stats } = useRepositoryStats(resolvedParams.id, shouldFetchStats);

    // Refresh data when indexing completes
    const queryClient = useQueryClient();
    useEffect(() => {
        if (statusData?.status === 'completed' && userTriggeredReindexRef.current) {
            userTriggeredReindexRef.current = false;
            queryClient.invalidateQueries({ queryKey: ['repository', resolvedParams.id] });
            queryClient.invalidateQueries({ queryKey: ['repository-stats', resolvedParams.id] });
        }
    }, [statusData?.status, resolvedParams.id, queryClient]);

    if (isRepoLoading) {
        return (
            <div className="flex min-h-screen flex-col bg-background">
                <Header />
                <main className="flex flex-1 items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 rounded border border-border bg-secondary flex items-center justify-center">
                             <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">Decoding Telemetry...</div>
                    </div>
                </main>
            </div>
        );
    }

    if (!repo) {
        return (
            <div className="flex min-h-screen flex-col bg-background">
                <Header />
                <main className="flex flex-1 items-center justify-center">
                    <div className="border border-border p-12 rounded-sm text-center max-w-md mx-4 bg-secondary/10">
                        <AlertCircle className="h-12 w-12 text-rose-500/50 mx-auto mb-6" />
                        <h1 className="text-2xl font-black text-foreground mb-2 uppercase tracking-tight">
                            Asset Not Found
                        </h1>
                        <p className="text-muted-foreground text-xs font-medium leading-relaxed uppercase">
                            Remote resource 0x{resolvedParams.id.slice(0, 8)} is offline or inaccessible.
                        </p>
                    </div>
                </main>
            </div>
        );
    }
    
    const handleIndex = async () => {
        userTriggeredReindexRef.current = true;
        try {
            await indexMutation.mutateAsync(repo.id);
            // Immediately refetch status after mutation succeeds to eliminate flicker gap
            queryClient.invalidateQueries({ queryKey: ['repository-status', resolvedParams.id] });
        } catch {
            userTriggeredReindexRef.current = false;
        }
    };

    // Determine if this is initial indexing (no stats yet) vs re-indexing (stats exist)
    const needsInitialIndexing = !stats && 
        (currentStatus === 'discovered' || currentStatus === 'pending' || 
         currentStatus === 'indexing' || currentStatus === 'failed');
    
    // Show banner when: mutation is pending OR status is actively indexing (with existing stats)
    const isReindexingInProgress = !!stats && 
        (indexMutation.isPending || isActivelyIndexing);

    // Show full-page indexing UI only for INITIAL indexing (no existing data)
    if (needsInitialIndexing) {
        const isIndexing = currentStatus === 'indexing' || currentStatus === 'pending';
        
        return (
             <div className="flex min-h-screen flex-col bg-background text-foreground">
                <Header />
                <main className="flex flex-1 items-center justify-center p-4">
                    <div className="border border-border p-8 rounded-sm text-center max-w-lg w-full bg-secondary/5 relative overflow-hidden">
                        {/* Background decoration */}
                         <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_0)] bg-[size:16px_16px] opacity-10 pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="h-16 w-16 mb-6 rounded border border-border bg-background flex items-center justify-center shadow-lg">
                                {isIndexing ? (
                                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                ) : (
                                    <Database className="h-8 w-8 text-primary" />
                                )}
                            </div>
                            
                            <h1 className="text-2xl font-black text-foreground mb-3 uppercase tracking-tight">
                                {isIndexing ? "Indexing in Progress" : "Repository Not Indexed"}
                            </h1>
                            
                            <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8 max-w-md">
                                {isIndexing 
                                    ? "Running deep static analysis and metric extraction. This may take a few minutes."
                                    : "This repository has been discovered but not yet indexed. Initialize the indexing process to generate analytics."
                                }
                            </p>

                            {!isIndexing && (
                                <Button 
                                    onClick={handleIndex}
                                    disabled={indexMutation.isPending}
                                    variant="primary"
                                    size="lg"
                                    className="px-8 text-xs font-black uppercase tracking-widest rounded-md"
                                >
                                    {indexMutation.isPending ? (
                                        <>
                                            <Loader2 className="h-3 w-3 animate-spin mr-2" />
                                            Initializing...
                                        </>
                                    ) : (
                                        <>
                                            <Cpu className="h-3 w-3 mr-2" />
                                            Initialize Indexing
                                        </>
                                    )}
                                </Button>
                            )}
                            
                            {repo.status === 'failed' && (
                                <div className="mt-6 flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>Last indexing failed. Please retry.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
             </div>
        );
    }

    // Default stats if missing (e.g. still indexing)
    const effectiveStats = stats || {
        totalCommits: 0,
        lastCommit: new Date().toISOString(),
        contributors: [],
        activity: [],
        busFactor: null,
        churn: []
    };

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/30">
            <Header />

            <main className="flex-1 relative z-10">
                <div className="container mx-auto max-w-7xl px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors group">
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-wider">Back to Dashboard</span>
                        </Link>
                        <RepoHeader 
                            repo={repo} 
                            stats={effectiveStats} 
                            onReindex={handleIndex}
                            isReindexing={indexMutation.isPending}
                        />
                        
                        {/* Inline Re-indexing Banner */}
                        {isReindexingInProgress && (
                            <div
                                key="reindex-banner"
                                className="mt-4 flex items-center gap-3 px-4 py-3 rounded border border-primary/30 bg-primary/5"
                            >
                                <Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0" />
                                <span className="text-sm font-medium text-foreground">
                                    Re-indexing in progress... Charts will update automatically when complete.
                                </span>
                            </div>
                        )}
                    </motion.div>

                    <div className="mt-8 grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 flex flex-col gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                            >
                                <ContributionHeatmap activity={effectiveStats.activity} />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                <ActivityChart activity={effectiveStats.activity} />
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            {effectiveStats.busFactor && (
                                <BusFactorChart data={effectiveStats.busFactor} />
                            )}
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className="mt-8"
                    >
                         {effectiveStats.churn && effectiveStats.churn.length > 0 && (
                            <ChurnChart churn={effectiveStats.churn} />
                         )}
                    </motion.div>
                </div>
            </main>

            {/* Global Precision Decoration */}
            <div className="fixed bottom-8 right-8 pointer-events-none opacity-20">
                <div className="flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Cpu className="h-4 w-4" />
                    <span>Precision.Analyst_V2</span>
                </div>
            </div>
        </div>
    );
}
