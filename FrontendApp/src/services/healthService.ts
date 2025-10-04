import { apiConfig } from './apiConfig';

export interface HealthCheckResult {
  isOnline: boolean;
  timestamp: Date;
}

export const healthService = {
  /**
   * Check if the API is online and healthy
   * @returns Promise with health check result
   */
  async checkHealth(): Promise<HealthCheckResult> {
    try {
      const response = await apiConfig.fetch('/health/keys', {
        method: 'GET',
      });
      
      return {
        isOnline: response.ok,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        isOnline: false,
        timestamp: new Date(),
      };
    }
  },

  /**
   * Get the API base URL
   */
  getBaseUrl(): string {
    return apiConfig.getBaseUrl();
  },
};
