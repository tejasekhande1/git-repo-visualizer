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

export function useRepository(id: string) {
  return useQuery({
    queryKey: ['repository', id],
    queryFn: () => api.getRepository(id),
    enabled: !!id,
  });
}

export function useRepositoryStats(id: string) {
  return useQuery({
    queryKey: ['repository-stats', id],
    queryFn: () => api.getRepositoryStats(id),
    enabled: !!id,
  });
}
