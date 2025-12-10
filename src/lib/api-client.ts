type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

class ApiClient {
    private baseURL: string;
    private defaultHeaders: HeadersInit;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    private async request<T>(
        endpoint: string,
        method: RequestMethod,
        options: RequestOptions = {}
    ): Promise<T> {
        const { params, headers, ...customConfig } = options;

        const url = new URL(`${this.baseURL}${endpoint}`);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        const config: RequestInit = {
            method,
            headers: {
                ...this.defaultHeaders,
                ...headers,
            },
            ...customConfig,
        };

        try {
            const response = await fetch(url.toString(), config);

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || `API Error: ${response.status} ${response.statusText}`);
            }

            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            }

            return {} as T; // Return empty object for empty responses (like 204)

        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    }

    public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'GET', options);
    }

    public post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'POST', {
            ...options,
            body: JSON.stringify(data),
        });
    }

    public put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'PUT', {
            ...options,
            body: JSON.stringify(data),
        });
    }

    public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'DELETE', options);
    }

    public patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'PATCH', {
            ...options,
            body: JSON.stringify(data),
        });
    }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
export const apiClient = new ApiClient(API_BASE_URL);

export default ApiClient;
