/**
 * Site-wide configuration
 */

export const siteConfig = {
    name: "First App",
    description: "A modern Next.js application",
    url: "https://example.com",
    ogImage: "https://example.com/og.jpg",
    links: {
        twitter: "https://twitter.com/yourhandle",
        github: "https://github.com/yourusername",
    },
    creator: {
        name: "Your Name",
        url: "https://yourwebsite.com",
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
