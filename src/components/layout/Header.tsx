import Link from "next/link";
import { navLinks, siteConfig } from "@/config/site";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-black/80">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold">
                    {siteConfig.name}
                </Link>
            </div>
        </header>
    );
}
