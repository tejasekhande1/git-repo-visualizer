import { Search, Plus } from "lucide-react";
import Button from "@/components/ui/Button";

interface DashboardHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onAddClick: () => void;
}

export default function DashboardHeader({
    searchQuery,
    setSearchQuery,
    onAddClick,
}: DashboardHeaderProps) {
    return (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    Dashboard
                </h1>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                    Manage and visualize your Git repositories
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search repositories..."
                        className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-gray-800 dark:bg-zinc-900 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100 sm:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Button onClick={onAddClick} className="gap-2 shadow-sm">
                    <Plus className="h-4 w-4" />
                    Add Repository
                </Button>
            </div>
        </div>
    );
}
