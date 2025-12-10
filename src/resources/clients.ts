import { HTTPClient } from '../http/client';
import { Configuration } from '../types/generated/src/runtime';
import { ClientApi } from '../types/generated/src/apis/ClientApi';
import type {
  PageOfClients,
} from '../types/generated/src/models';

export interface ClientListParams {
  page?: number;
}

/**
 * Clients resource
 */
export class ClientsResource {
  private clientApi: ClientApi;

  constructor(
    private httpClient: HTTPClient,
    config: Configuration
  ) {
    this.clientApi = new ClientApi(config);
  }

  /**
   * List clients (only commission type)
   */
  async list(params?: ClientListParams): Promise<PageOfClients> {
    return this.clientApi.getAppEcommerceApiV2GetclientsInvoke(params?.page);
  }
}

