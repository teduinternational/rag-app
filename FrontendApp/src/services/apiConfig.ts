/**
 * API Configuration
 * Centralized configuration for all API services
 */

// API Base URL - can be overridden via environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:5154';

// Mock JWT token - replace with actual authentication service
let authToken: string | null = null;

export const apiConfig = {
  /**
   * Get the API base URL
   */
  getBaseUrl(): string {
    return API_BASE_URL;
  },

  /**
   * Get authentication headers
   * TODO: Replace with actual JWT authentication
   */
  getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add Bearer token if available
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    return headers;
  },

  /**
   * Set authentication token
   * @param token JWT token from authentication service
   */
  setAuthToken(token: string | null): void {
    authToken = token;
  },

  /**
   * Get current authentication token
   */
  getAuthToken(): string | null {
    return authToken;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return authToken !== null;
  },

  /**
   * Clear authentication token (logout)
   */
  clearAuthToken(): void {
    authToken = null;
  },

  /**
   * Make authenticated fetch request
   * @param url Full URL or path (will be prefixed with base URL if path)
   * @param options Fetch options
   */
  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    // Construct full URL if relative path is provided
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

    // Merge auth headers with provided headers
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    return fetch(fullUrl, {
      ...options,
      headers,
    });
  },

  /**
   * Mock login function for development
   * TODO: Replace with actual authentication API call
   */
  async mockLogin(username: string, password: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock JWT token generation
    const mockToken = btoa(JSON.stringify({
      sub: username,
      name: username,
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    }));

    this.setAuthToken(mockToken);
    return mockToken;
  },
};

// Export for convenient imports
export default apiConfig;
