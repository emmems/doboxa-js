import { Configuration } from './types/generated/src/runtime';
import { HTTPClient } from './http/client';
import { TokenManager } from './utils/tokenManager';
import { getBaseURL } from './utils/config';
import { AuthenticationResource } from './resources/authentication';
import { OrdersResource } from './resources/orders';
import { InvoicesResource } from './resources/invoices';
import { ClientsResource } from './resources/clients';
import { DiscountCodesResource } from './resources/discountCodes';
import { TrackingNumbersResource } from './resources/trackingNumbers';
import { OrderCommentsResource } from './resources/orderComments';
import { OrderStatusChangesResource } from './resources/orderStatusChanges';
import { UsersResource } from './resources/users';

export interface DoboxaConfig {
  /**
   * API key (access token). If not provided, you must call authentication.login() first.
   */
  apiKey?: string;
  /**
   * Base URL for the API. Defaults to DOBOXA_API_URL environment variable or http://localhost
   */
  baseURL?: string;
}

/**
 * Main Doboxa client class
 */
export class Doboxa {
  public readonly authentication: AuthenticationResource;
  public readonly orders: OrdersResource;
  public readonly invoices: InvoicesResource;
  public readonly clients: ClientsResource;
  public readonly discountCodes: DiscountCodesResource;
  public readonly trackingNumbers: TrackingNumbersResource;
  public readonly orderComments: OrderCommentsResource;
  public readonly orderStatusChanges: OrderStatusChangesResource;
  public readonly users: UsersResource;

  private tokenManager: TokenManager;
  private httpClient: HTTPClient;
  private config: Configuration;

  constructor(config: DoboxaConfig = {}) {
    const baseURL = config.baseURL || getBaseURL() || 'http://localhost';
    
    this.tokenManager = new TokenManager();
    if (config.apiKey) {
      this.tokenManager.setTokens(config.apiKey, '', 3600);
    }

    // Create configuration for generated APIs
    // Note: Generated APIs use apiKey for Bearer authentication
    this.config = new Configuration({
      basePath: baseURL,
      apiKey: async (name: string) => {
        if (name === 'Authorization') {
          const token = this.tokenManager.getAccessToken();
          if (!token) {
            throw new Error('No access token available');
          }
          return `Bearer ${token}`;
        }
        throw new Error(`Unknown API key name: ${name}`);
      },
    });

    // Create HTTP client with token refresh callback
    // Note: We create a temporary HTTP client for token refresh to avoid circular dependency
    const tempHttpClient = new HTTPClient({
      baseURL,
      tokenManager: this.tokenManager,
    });

    this.httpClient = new HTTPClient({
      baseURL,
      tokenManager: this.tokenManager,
      onTokenRefresh: async (refreshToken: string) => {
        // Use temporary HTTP client to refresh token (avoids circular dependency)
        const tempAuth = new AuthenticationResource(tempHttpClient, this.tokenManager);
        const response = await tempAuth.refreshToken(refreshToken);
        this.tokenManager.setTokens(response.token!, response.refresh_token!, 3600);
        return response.token!;
      },
    });

    // Initialize resources
    this.authentication = new AuthenticationResource(this.httpClient, this.tokenManager);
    this.orders = new OrdersResource(this.httpClient, this.config);
    this.invoices = new InvoicesResource(this.httpClient, this.config);
    this.clients = new ClientsResource(this.httpClient, this.config);
    this.discountCodes = new DiscountCodesResource(this.httpClient, this.config);
    this.trackingNumbers = new TrackingNumbersResource(this.httpClient, this.config);
    this.orderComments = new OrderCommentsResource(this.httpClient, this.config);
    this.orderStatusChanges = new OrderStatusChangesResource(this.httpClient, this.config);
    this.users = new UsersResource(this.httpClient, this.config);
  }
}

