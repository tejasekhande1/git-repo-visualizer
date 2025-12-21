import { useState } from "react";
import { X, Loader2, Link2, Box } from "lucide-react";
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

    const handleModalClose = () => {
        resetFormState();
        onClose();
    };

    const resetFormState = () => {
        setUrl("");
        setError("");
    };

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
            setError("ERR: REMOTE_ACCESS_DENIED");
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
                        onClick={handleModalClose}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded border border-border bg-background p-8 shadow-2xl"
                    >
                        <div className="relative z-10">
                            <div className="mb-8 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded bg-foreground flex items-center justify-center">
                                        <Box className="h-4 w-4 text-background" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold tracking-tight text-foreground uppercase">
                                            Ingest Resource
                                        </h2>
                                        <p className="text-[10px] font-mono font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">0x7F - Provisioning Sequence</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleModalClose}
                                    className="h-8 w-8 rounded hover:bg-secondary flex items-center justify-center transition-colors"
                                >
                                    <X className="h-4 w-4 text-muted-foreground" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="repo-url"
                                        className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-0.5"
                                    >
                                        Endpoint URL (GitHub/Remote)
                                    </label>
                                    <div className="relative group">
                                        <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                        <input
                                            id="repo-url"
                                            type="url"
                                            placeholder="https://github.com/org/repo"
                                            className="h-12 w-full rounded border border-border bg-secondary/30 pl-10 pr-4 text-xs font-semibold outline-none transition-all placeholder:text-muted-foreground/30 focus:border-foreground/30 focus:ring-1 focus:ring-foreground/5"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    {error && (
                                        <div className="mt-2 text-[10px] font-mono font-bold text-rose-500 uppercase tracking-tighter">
                                            {error}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleModalClose}
                                        disabled={isLoading}
                                    >
                                        Abort
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        variant="default" 
                                        size="md"
                                        disabled={isLoading || !url} 
                                        className="min-w-[140px]"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            "Confirm Ingest"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
