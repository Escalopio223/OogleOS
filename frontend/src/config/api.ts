export const API_BASE_URL: string = (
    import.meta.env.VITE_API_URL || 'http://localhost:3000'
).replace(/\/+$/, '');

export function apiUrl(path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
}

