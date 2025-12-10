/**
 * Common TypeScript types and interfaces
 */

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    author: User;
    createdAt: Date;
    updatedAt: Date;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: string;
}

export type Status = "idle" | "loading" | "success" | "error";

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}
