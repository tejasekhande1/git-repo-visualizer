"use client";

import { useState, useEffect } from "react";
import { DashboardHeader, RepositoryList, AddRepositoryModal } from "@/components/dashboard";
import { Header, Footer } from "@/components/layout";
import { api, type Repository } from "@/lib/api";

export default function Home() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadRepositories();
  }, []);

  const loadRepositories = async () => {
    try {
      setIsLoading(true);
      const data = await api.getRepositories();
      setRepositories(data);
    } catch (error) {
      console.error("Failed to load repositories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRepository = async (url: string) => {
    const newRepo = await api.createRepository(url);
    setRepositories((prev) => [...prev, newRepo]);
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
            onAddClick={() => setIsModalOpen(true)}
          />

          <RepositoryList
            repositories={filteredRepositories}
            isLoading={isLoading}
          />
        </div>
      </main>

      <Footer />

      <AddRepositoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddRepository}
      />
    </div>
  );
}
