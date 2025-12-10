import type { Configuration } from "../types/generated/src/runtime";
import { TokenManager } from "../utils/tokenManager";
import {
  DoboxaAPIError,
  DoboxaAuthenticationError,
  parseErrorResponse,
} from "../errors";

export interface HTTPClientConfig {
  baseURL?: string;
  tokenManager: TokenManager;
  onTokenRefresh?: (token: string) => Promise<string>;
}

/**
 * HTTP client wrapper around fetch with Bearer token injection and error handling
 */
export class HTTPClient {
  private baseURL: string;
  private tokenManager: TokenManager;
  private onTokenRefresh?: (token: string) => Promise<string>;

  constructor(config: HTTPClientConfig) {
    this.baseURL = config.baseURL || "http://localhost";
    this.tokenManager = config.tokenManager;
    this.onTokenRefresh = config.onTokenRefresh;
  }

  /**
   * Make an HTTP request
   */
  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    // Ensure path starts with /
    const url = `${this.baseURL}${path.startsWith("/") ? path : `/${path}`}`;

    // Get or refresh token
    let accessToken = this.tokenManager.getAccessToken();

    if (!accessToken || this.tokenManager.isTokenExpired()) {
      if (this.onTokenRefresh) {
        const refreshToken = this.tokenManager.getRefreshToken();
        if (refreshToken) {
          // Check if refresh is already in progress
          let refreshPromise = this.tokenManager.getRefreshPromise();
          if (!refreshPromise) {
            refreshPromise = this.onTokenRefresh(refreshToken);
            this.tokenManager.setRefreshPromise(refreshPromise);
          }

          try {
            accessToken = await refreshPromise;
          } finally {
            this.tokenManager.setRefreshPromise(null);
          }
        }
      }
    }

    // Prepare headers
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${accessToken}`);

    console.log("url", url);
    // Make request
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Parse response
    let responseBody: unknown;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        responseBody = await response.json();
      } catch {
        // Ignore JSON parse errors
      }
    } else {
      responseBody = await response.text();
    }

    // Handle errors
    if (!response.ok) {
      const errorBody = parseErrorResponse(response.status, responseBody);
      const errorMessage =
        (errorBody && "error_message" in errorBody
          ? errorBody.error_message
          : undefined) ||
        response.statusText ||
        `HTTP ${response.status}`;

      // Handle 401/403 as authentication errors
      if (response.status === 401 || response.status === 403) {
        throw new DoboxaAuthenticationError(errorMessage);
      }

      throw new DoboxaAPIError(response.status, errorMessage, errorBody);
    }

    return responseBody as T;
  }

  /**
   * GET request
   */
  async get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(
    path: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    path: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    path: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}
