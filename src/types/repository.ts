export interface Contributor {
    name: string;
    email: string;
    commits: number;
    avatarUrl?: string;
}

export interface ActivityLevel {
    date: string; // YYYY-MM-DD
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

export interface GitStats {
    totalCommits: number;
    lastCommit: string;
    contributors: Contributor[];
    activity: ActivityLevel[];
}

export interface Repository {
    id: string;
    name: string;
    url: string;
    createdAt: string;
    starCount: number;
    forkCount: number;
    description?: string;
}
