"use client";

import { DashboardHeader, RepositoryList, AddRepositoryModal } from "@/components/dashboard";
import { Header } from "@/components/layout";
import { useUIStore } from "@/lib/store";
import { useRepositories, useCreateRepository } from "@/hooks/useRepositories";

export default function Home() {
  const { searchQuery, setSearchQuery, isAddModalOpen, setIsAddModalOpen } = useUIStore();
  const { data: repositories = [], isLoading } = useRepositories();
  const createRepoMutation = useCreateRepository();

  const handleAddRepository = async (url: string) => {
    await createRepoMutation.mutateAsync(url);
  };

  const filteredRepositories = repositories.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
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
