"use client";

import { useState } from "react";
import Link from "next/link";
import { Workflow, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { GithubIcon, GoogleIcon } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSocialLogin = (provider: "github" | "google") => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    window.location.href = `${backendUrl}/auth/${provider}/login`;
  };

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{ user: any; token: string }>("/auth/login", {
        email,
        password,
      });
      
      setAuth(response.user, response.token);
      router.push("/");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-20 selection:bg-primary/30">
      <div className="w-full max-w-[420px]">
        {/* Access terminal header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded border border-border bg-secondary/50 shadow-[0_0_25px_rgba(139,92,246,0.1)]">
            <Workflow className="h-6 w-6 text-foreground" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-foreground uppercase">
            {t("auth.access")}
          </h1>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
            {t("auth.sequence")}
          </p>
        </div>

        {/* Auth Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded border border-border bg-background p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
        >
          {/* Decorative Corner */}
          <div className="absolute -right-[1px] -top-[1px] h-4 w-4 border-r border-t border-primary/40" />
          <div className="absolute -bottom-[1px] -left-[1px] h-4 w-4 border-b border-l border-primary/40" />

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="flex items-center gap-2 rounded border border-rose-500/20 bg-rose-500/5 p-3 text-[11px] font-bold text-rose-500 uppercase tracking-tight">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Auth */}
          <div className="flex flex-col gap-3">
            <Button
              variant="precision"
              className="h-11 w-full gap-3 rounded-sm border-border bg-secondary/30 hover:bg-secondary/60 disabled:opacity-50"
              onClick={() => handleSocialLogin("github")}
              disabled={isLoading}
            >
              <GithubIcon className="h-4 w-4" />
              Analyze via GitHub
            </Button>
            <Button
              variant="precision"
              className="h-11 w-full gap-3 rounded-sm border-border bg-secondary/30 hover:bg-secondary/60 disabled:opacity-50"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
            >
              <GoogleIcon className="h-4 w-4" />
              Analyze via Google
            </Button>
          </div>

          <div className="my-8 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-border/50" />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
              OR
            </span>
            <div className="h-[1px] flex-1 bg-border/50" />
          </div>

          <form
            className="flex flex-col gap-5"
            onSubmit={handleCredentialLogin}
          >
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="ml-0.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60"
              >
                {t("auth.email")}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.io"
                disabled={isLoading}
                className="h-11 w-full rounded border border-border bg-secondary/20 px-4 text-xs font-bold outline-none transition-all placeholder:text-muted-foreground/20 focus:border-foreground/30 focus:ring-1 focus:ring-foreground/5 disabled:opacity-50"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="ml-0.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60"
              >
                {t("auth.password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="h-11 w-full rounded border border-border bg-secondary/20 px-4 pr-10 text-xs font-bold outline-none transition-all placeholder:text-muted-foreground/20 focus:border-foreground/30 focus:ring-1 focus:ring-foreground/5 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              variant="default"
              type="submit"
              disabled={isLoading}
              className="mt-2 h-11 w-full gap-2 rounded-sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {t("auth.initialize")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </form>
        </motion.div>

        <p className="mt-10 text-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50">
          {t("auth.request")}{" "}
          <Link
            href="/signup"
            className="text-primary transition-colors hover:text-indigo-400"
          >
            {t("auth.provision")}
          </Link>
        </p>
      </div>
    </div>
  );
}
