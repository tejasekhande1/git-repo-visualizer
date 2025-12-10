import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
    return (
        <footer className="w-full border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        {siteConfig.links.github && (
                            <Link
                                href={siteConfig.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                            >
                                GitHub
                            </Link>
                        )}
                        {siteConfig.links.twitter && (
                            <Link
                                href={siteConfig.links.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                            >
                                Twitter
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
