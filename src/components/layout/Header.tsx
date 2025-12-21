import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/components/ui/Button";
import { LogOut, User as UserIcon, Workflow } from "lucide-react";
import Image from "next/image";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

import { useRouter } from "next/navigation";

export default function Header() {
    const { user, logout } = useAuthStore();
    const { t } = useTranslation();
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
            <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded bg-foreground flex items-center justify-center">
                        <Workflow className="h-4 w-4 text-background" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-foreground uppercase">
                        {t("common.appName")}
                    </span>
                </Link>

                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-2 py-1 rounded border border-border bg-secondary/50">
                                {user.avatarURL ? (
                                    <Image 
                                        src={user.avatarURL} 
                                        alt={user.name} 
                                        width={20}
                                        height={20}
                                        className="h-5 w-5 rounded-sm grayscale"
                                        unoptimized
                                    />
                                ) : (
                                    <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                )}
                                <span className="hidden text-[11px] font-bold uppercase tracking-widest text-foreground sm:block">
                                    {user.name}
                                </span>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={() => {
                                    logout();
                                    router.push("/login");
                                }}
                            >
                                <LogOut className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">{t("nav.signIn")}</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
