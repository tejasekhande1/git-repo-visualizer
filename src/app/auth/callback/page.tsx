"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Loader2, Workflow } from "lucide-react";
import { motion } from "framer-motion";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      console.error("Authentication error:", error);
      router.push("/login?error=" + encodeURIComponent(error));
      return;
    }

    if (token) {
      try {
        // Simple JWT decode to get user info
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));
        
        setAuth({
          id: String(payload.sub || payload.user_id || payload.id),
          email: payload.email || "",
          name: payload.name || "Analyst",
          avatarURL: payload.avatar_url,
        }, token);
        
        // Brief delay for visual feedback before redirect
        setTimeout(() => {
            router.push("/");
        }, 1500);
      } catch (e) {
        console.error("Failed to parse token:", e);
        setAuth(null, token); 
        router.push("/");
      }
    } else {
      router.push("/login");
    }
  }, [searchParams, router, setAuth]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center selection:bg-primary/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center"
      >
        <div className="mb-8 relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-secondary/50 shadow-[0_0_40px_rgba(139,92,246,0.2)]">
                <Workflow className="h-10 w-10 text-primary" />
            </div>
        </div>
        
        <h2 className="text-2xl font-black tracking-tighter text-foreground uppercase">
          Authenticating Sequence
        </h2>
        <div className="mt-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            <span>Verifying Telemetry...</span>
        </div>
        
        <div className="mt-12 max-w-[280px]">
            <div className="h-1 items-center justify-between flex gap-1">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0.1 }}
                        animate={{ opacity: [0.1, 1, 0.1] }}
                        transition={{ 
                            duration: 1.5, 
                            repeat: Infinity, 
                            delay: i * 0.2 
                        }}
                        className="h-1 flex-1 bg-primary rounded-full"
                    />
                ))}
            </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
        </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
