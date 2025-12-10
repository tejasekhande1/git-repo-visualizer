import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

interface AddRepositoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (url: string) => Promise<void>;
}

export default function AddRepositoryModal({
    isOpen,
    onClose,
    onSubmit,
}: AddRepositoryModalProps) {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) return;

        try {
            setIsLoading(true);
            setError("");
            await onSubmit(url);
            setUrl("");
            onClose();
        } catch (err) {
            setError("Failed to add repository. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-zinc-900"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                Add Repository
                            </h2>
                            <button
                                onClick={onClose}
                                className="rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label
                                    htmlFor="repo-url"
                                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Repository URL
                                </label>
                                <input
                                    id="repo-url"
                                    type="url"
                                    placeholder="https://github.com/username/repo"
                                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-gray-800 dark:bg-zinc-800 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    autoFocus
                                />
                                {error && (
                                    <p className="mt-2 text-sm text-red-500">{error}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    className=" hover:text-black"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading || !url}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Add Repository
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
