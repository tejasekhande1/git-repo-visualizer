/**
 * Application-wide constants
 */

export const APP_NAME = "First App";

export const APP_DESCRIPTION = "A Next.js application";

export const ROUTES = {
    HOME: "/",
    ABOUT: "/about",
    CONTACT: "/contact",
} as const;

export const API_ROUTES = {
    USERS: "/api/users",
    POSTS: "/api/posts",
} as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const SUPPORTED_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/webp"];
