import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Repository } from '@/types/repository';

export function useRepositories() {
  return useQuery({
    queryKey: ['repositories'],
    queryFn: () => api.getRepositories(),
  });
}

export function useCreateRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (url: string) => api.createRepository(url),
    onSuccess: (newRepo) => {
      // Optimistic update or just invalidation
      queryClient.setQueryData(['repositories'], (old: Repository[] | undefined) => {
        return old ? [...old, newRepo] : [newRepo];
      });
    },
  });
}

export function useSyncRepositories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.syncRepositories(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
    },
  });
}

export function useRepository(id: string) {
  return useQuery({
    queryKey: ['repository', id],
    queryFn: () => api.getRepository(id),
    enabled: !!id,
  });
}

export function useRepositoryStats(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['repository-stats', id],
    queryFn: () => api.getRepositoryStats(id),
    enabled: !!id && enabled,
    retry: false, // Don't retry on indexing errors
    staleTime: 30000, // Keep data fresh for 30s to avoid refetching during re-index
  });
}

export function useIndexRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => api.indexRepository(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['repository', String(id)] });
      queryClient.invalidateQueries({ queryKey: ['repository-status', String(id)] });
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
    },
  });
}

export function useRepositoryStatus(id: string, initialStatus?: Repository['status']) {
  return useQuery({
    queryKey: ['repository-status', id],
    queryFn: () => api.getRepositoryStatus(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status || initialStatus;
      return (status === 'indexing' || status === 'pending') ? 2000 : false;
    },
  });
}
