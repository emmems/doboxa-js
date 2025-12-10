import { HTTPClient } from '../http/client';
import { TokenManager } from '../utils/tokenManager';
import type {
  ApiV2AuthenticationTokenPostRequest,
  ApiV2AuthenticationTokenPost200Response,
  ApiV2AuthenticationRefreshTokenPostRequest,
  ApiV2AuthenticationRefreshTokenPost200Response,
} from '../types/generated/src/models';

export interface LoginParams {
  username: string;
  password: string;
}

export interface RefreshTokenParams {
  refresh_token: string;
}

/**
 * Authentication resource
 */
export class AuthenticationResource {
  constructor(
    private httpClient: HTTPClient,
    private tokenManager: TokenManager
  ) {}

  /**
   * Login with username and password
   */
  async login(params: LoginParams): Promise<ApiV2AuthenticationTokenPost200Response> {
    const request: ApiV2AuthenticationTokenPostRequest = {
      username: params.username,
      password: params.password,
    };

    const response = await this.httpClient.post<ApiV2AuthenticationTokenPost200Response>(
      '/api/v2/authentication/token',
      request
    );

    // Store tokens
    if (response.token && response.refresh_token) {
      this.tokenManager.setTokens(response.token, response.refresh_token, 3600);
    }

    return response;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(
    refreshToken: string
  ): Promise<ApiV2AuthenticationRefreshTokenPost200Response> {
    const request: ApiV2AuthenticationRefreshTokenPostRequest = {
      refresh_token: refreshToken,
    };

    const response = await this.httpClient.post<ApiV2AuthenticationRefreshTokenPost200Response>(
      '/api/v2/authentication/refresh_token',
      request
    );

    // Store new tokens
    if (response.token && response.refresh_token) {
      this.tokenManager.setTokens(response.token, response.refresh_token, 3600);
    }

    return response;
  }
}

