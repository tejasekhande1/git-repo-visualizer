/**
 * API Service for Git Repository Visualizer
 * Simulates backend data for initial frontend development
 */

import { Repository, GitStats, Contributor, ActivityLevel } from '@/types/repository';

export type { Repository, GitStats, Contributor, ActivityLevel };

// Mock Data
const MOCK_REPOS: Repository[] = [
    {
        id: "1",
        name: "facebook/react",
        url: "https://github.com/facebook/react",
        createdAt: "2013-05-24T16:07:38Z",
        starCount: 203000,
        forkCount: 42000,
        description: "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
    },
    {
        id: "2",
        name: "vercel/next.js",
        url: "https://github.com/vercel/next.js",
        createdAt: "2016-10-05T23:32:51Z",
        starCount: 112000,
        forkCount: 24000,
        description: "The React Framework.",
    },
    {
        id: "3",
        name: "tailwindlabs/tailwindcss",
        url: "https://github.com/tailwindlabs/tailwindcss",
        createdAt: "2017-11-01T10:35:42Z",
        starCount: 75000,
        forkCount: 4000,
        description: "A utility-first CSS framework for rapid UI development.",
    },
];

const MOCK_STATS: GitStats = {
    totalCommits: 15432,
    lastCommit: new Date().toISOString(),
    contributors: [
        { name: "Dan Abramov", email: "dan@example.com", commits: 1250, avatarUrl: "https://github.com/gaearon.png" },
        { name: "Lee Robinson", email: "lee@example.com", commits: 850, avatarUrl: "https://github.com/leerob.png" },
        { name: "Tim Neutkens", email: "tim@example.com", commits: 2100, avatarUrl: "https://github.com/timneutkens.png" },
        { name: "Shadcn", email: "admin@shadcn.com", commits: 450, avatarUrl: "https://github.com/shadcn.png" },
        { name: "Rich Harris", email: "rich@example.com", commits: 920, avatarUrl: "https://github.com/Rich-Harris.png" },
    ],
    activity: Array.from({ length: 365 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (364 - i));
        const count = Math.floor(Math.random() * 20);
        return {
            date: date.toISOString().split("T")[0],
            count,
            level: count === 0 ? 0 : count < 5 ? 1 : count < 10 ? 2 : count < 15 ? 3 : 4,
        } as ActivityLevel;
    }),
};

// API Service
export const api = {
    getRepositories: async (): Promise<Repository[]> => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        return MOCK_REPOS;
    },

    createRepository: async (url: string): Promise<Repository> => {
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Extract basic name from URL
        const name = url.split("/").slice(-2).join("/") || url;

        const newRepo: Repository = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            url,
            createdAt: new Date().toISOString(),
            starCount: 0,
            forkCount: 0,
            description: "Newly simulated repository",
        };

        // In a real app we would add to MOCK_REPOS here if we wanted local persistence
        MOCK_REPOS.push(newRepo); // Simple in-memory persistence

        return newRepo;
    },

    getRepositoryStats: async (id: string): Promise<GitStats> => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return MOCK_STATS;
    },

    getRepository: async (id: string): Promise<Repository | undefined> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_REPOS.find(r => r.id === id);
    }
};
