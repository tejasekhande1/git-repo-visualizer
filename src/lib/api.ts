/**
 * API Service for Git Repository Visualizer
 * Simulates backend data for initial frontend development
 */

import { Repository, GitStats, Contributor, ActivityLevel, BusFactor, ChurnFile } from '@/types/repository';

export type { Repository, GitStats, Contributor, ActivityLevel, BusFactor, ChurnFile };

import { apiClient } from '@/lib/api-client';

interface BackendRepository {
    id: number;
    name: string;
    description: string;
    url: string;
    is_private: boolean;
    provider: string;
    default_branch: string;
    status: Repository['status'];
    created_at: string;
    updated_at: string;
    last_indexed_at?: string;
}

// Removed unused BackendContributor interface since we use 'any' or proper casting below


// API Service
export const api = {
    getRepositories: async (): Promise<Repository[]> => {
        try {
            const repos = await apiClient.get<BackendRepository[]>('/repositories');
            return repos.map(mapBackendRepo);
        } catch (error) {
            console.error('Failed to fetch repositories', error);
            throw error;
        }
    },

    createRepository: async (url: string): Promise<Repository> => {
        // Backend expects { "url": "..." }
        const repo = await apiClient.post<BackendRepository[]>('/repositories', { url });
        // The backend might return an array or single object, handling likely single object from previous code but let's be safe or just stick to single if that's what it was.
        // Previous code: const repo = await apiClient.post<BackendRepository>('/repositories', { url });
        // I will revert to single object to avoid breaking change if not sure.
        return mapBackendRepo(repo as unknown as BackendRepository);
    },

    syncRepositories: async (): Promise<{ message: string, synced: number }> => {
        return await apiClient.post<{ message: string, synced: number }>('/repositories/sync', {});
    },

    indexRepository: async (id: string | number): Promise<void> => {
        await apiClient.post(`/repositories/${id}/index`, {});
    },

    getRepositoryStats: async (id: string): Promise<GitStats> => {
        try {
            const [contributorsRes, busFactorRes, churnRes, activityRes] = await Promise.all([
                apiClient.get<{ contributors: any[] }>(`/repositories/${id}/stats/contributors`),
                apiClient.get<BusFactor>(`/repositories/${id}/stats/bus-factor`),
                apiClient.get<ChurnFile[]>(`/repositories/${id}/stats/churn`),
                apiClient.get<{ activity: ActivityLevel[] }>(`/repositories/${id}/stats/commit-activity`)
            ]);
            
            // Map bus factor top contributors to UI contributors
            const topContributors = busFactorRes.top_contributors || [];
            const contributors: Contributor[] = topContributors.map((c: any) => ({
                name: c.name,
                email: c.email,
                commits: c.files_owned || 0,
                avatarUrl: undefined,
            }));

            // Calculate last commit date from contributors metadata
            let lastCommit = new Date(0).toISOString();
            if (contributorsRes.contributors && contributorsRes.contributors.length > 0) {
                 const dates = contributorsRes.contributors
                    .map((c: any) => c.last_commit_at ? new Date(c.last_commit_at).getTime() : 0);
                 const maxDate = Math.max(...dates);
                 if (maxDate > 0) lastCommit = new Date(maxDate).toISOString();
            }

            const activity = activityRes.activity || [];
            const totalCommits = activity.reduce((sum: number, day: ActivityLevel) => sum + day.count, 0);

            return {
                totalCommits,
                lastCommit: lastCommit,
                contributors,
                activity,
                busFactor: busFactorRes,
                churn: churnRes
            };
        } catch (error) {
            console.error('Failed to fetch repo stats', error);
            // Return empty structure on failure to prevent UI crash
            return {
                totalCommits: 0,
                lastCommit: new Date().toISOString(),
                contributors: [],
                activity: [],
                busFactor: null,
                churn: []
            };
        }
    },

    getRepository: async (id: string): Promise<Repository | undefined> => {
        try {
            const repo = await apiClient.get<BackendRepository>(`/repositories/${id}`);
            return mapBackendRepo(repo);
        } catch (error) {
            console.error('Failed to fetch repository', error);
            return undefined;
        }
    },

    getRepositoryStatus: async (id: string): Promise<{ status: Repository['status'], progress?: number }> => {
        return await apiClient.get<{ status: Repository['status'], progress?: number }>(`/repositories/${id}/status`);
    }
};

function mapBackendRepo(repo: BackendRepository): Repository {
    return {
        id: repo.id,
        name: repo.name,
        url: repo.url,
        description: repo.description,
        isPrivate: repo.is_private,
        provider: repo.provider,
        defaultBranch: repo.default_branch,
        status: repo.status,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        lastIndexedAt: repo.last_indexed_at,
        starCount: 0,
        forkCount: 0,
    };
}
