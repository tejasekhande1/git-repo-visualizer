"use client";

import { DashboardHeader, RepositoryList, AddRepositoryModal } from "@/components/dashboard";
import { Header } from "@/components/layout";
import { useUIStore } from "@/lib/store";
import { useRepositories, useCreateRepository, useSyncRepositories } from "@/hooks/useRepositories";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  const { searchQuery, setSearchQuery, isAddModalOpen, setIsAddModalOpen } = useUIStore();
  const { data: repositories = [], isLoading, error, isError } = useRepositories();
  const createRepoMutation = useCreateRepository();

  useEffect(() => {
    if (isError && error) {
      toast.error(error.message || "Failed to fetch repositories");
    }
  }, [isError, error]);

  const handleAddRepository = async (url: string) => {
    await createRepoMutation.mutateAsync(url);
  };

  const syncRepoMutation = useSyncRepositories();

  const handleSyncRepositories = async () => {
      try {
          const result = await syncRepoMutation.mutateAsync();
          toast.success(result.message || "Repositories synced successfully");
      } catch {
          toast.error("Failed to sync repositories");
      }
  };

  const filteredRepositories = repositories.filter((repo) =>
    (repo.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <DashboardHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddClick={() => setIsAddModalOpen(true)}
            onSyncClick={handleSyncRepositories}
          />

          <RepositoryList
            repositories={filteredRepositories}
            isLoading={isLoading}
          />
        </div>
      </main>

      <AddRepositoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddRepository}
      />
    </div>
  );
}
