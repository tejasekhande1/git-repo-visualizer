import { apiClient } from '@/lib/api-client';
import { Repository, GitStats } from '@/types/repository';

export const repositoryApi = {
    getAll: async (): Promise<Repository[]> => {
        return apiClient.get<Repository[]>('/repositories');
    },

    getById: async (id: string): Promise<Repository> => {
        return apiClient.get<Repository>(`/repositories/${id}`);
    },

    create: async (url: string): Promise<Repository> => {
        return apiClient.post<Repository>('/repositories', { url });
    },

    getStats: async (id: string): Promise<GitStats> => {
        return apiClient.get<GitStats>(`/repositories/${id}/stats`);
    },

    update: async (id: string, data: Partial<Repository>): Promise<Repository> => {
        return apiClient.put<Repository>(`/repositories/${id}`, data);
    },

    delete: async (id: string): Promise<void> => {
        return apiClient.delete<void>(`/repositories/${id}`);
    },
};
