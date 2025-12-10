/**
 * Token manager for handling access tokens and refresh tokens
 */
export class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private refreshPromise: Promise<string> | null = null;

  /**
   * Set tokens and calculate expiry
   */
  setTokens(accessToken: string, refreshToken: string, expiresIn: number = 3600): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    // Set expiry to 5 seconds before actual expiry for safety
    this.tokenExpiry = Date.now() + (expiresIn - 5) * 1000;
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  /**
   * Check if token is expired or will expire soon
   */
  isTokenExpired(): boolean {
    if (!this.tokenExpiry || !this.accessToken) {
      return true;
    }
    return Date.now() >= this.tokenExpiry;
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    this.refreshPromise = null;
  }

  /**
   * Set refresh promise to prevent concurrent refresh requests
   */
  setRefreshPromise(promise: Promise<string> | null): void {
    this.refreshPromise = promise;
  }

  /**
   * Get current refresh promise
   */
  getRefreshPromise(): Promise<string> | null {
    return this.refreshPromise;
  }
}

