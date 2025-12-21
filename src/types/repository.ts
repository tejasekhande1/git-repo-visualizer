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

export interface BusFactor {
    bus_factor: number;
    risk_level?: string;
    total_files?: number;
    threshold?: number;
    top_contributors: { 
        email: string; 
        name: string; 
        files_owned: number; 
        ownership_pct: number;
    }[];
}

export interface ChurnFile {
    file_path: string;
    additions: number;
    deletions: number;
    churn_score: number;
    commit_count: number;
    lines_changed: number;
    last_modified: string;
    category: 'hotspot' | 'frequent' | 'massive' | 'stable';
}

export interface GitStats {
    totalCommits: number;
    lastCommit: string;
    contributors: Contributor[];
    activity: ActivityLevel[];
    busFactor?: BusFactor | null;
    churn?: ChurnFile[];
}

export interface Repository {
    id: string | number;
    name: string | null;
    url: string;
    isPrivate: boolean;
    provider: string;
    defaultBranch: string;
    status: 'discovered' | 'pending' | 'indexing' | 'completed' | 'failed';
    description?: string | null;
    language?: string;
    createdAt: string;
    updatedAt: string;
    lastIndexedAt?: string;
    // UI specific (optional or calculated)
    starCount?: number;
    forkCount?: number;
}
