/**
 * Site-wide configuration
 */

export const siteConfig = {
    name: "Panini",
    description: "A sleek Next.js dashboard that transforms Git activity into clear, interactive visual insights for contributors, commits, and repository trends.",
    url: "https://example.com",
    ogImage: "https://example.com/og.jpg",
    links: {
        twitter: "https://twitter.com/yourhandle",
        github: "https://github.com/yourusername",
    },
    creator: {
        name: "Tejas Ekhande",
        url: "https://www.tejasekhande.dev",
    },
};

export const navLinks = [
    {
        title: "Home",
        href: "/",
    },
    {
        title: "About",
        href: "/about",
    },
    {
        title: "Contact",
        href: "/contact",
    },
];

export type SiteConfig = typeof siteConfig;
export type NavLink = (typeof navLinks)[number];
