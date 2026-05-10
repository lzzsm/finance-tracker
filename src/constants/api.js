const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const API_URL = `${BASE_URL}/transactions`;
export const AUTH_URL = `${BASE_URL}/auth`;