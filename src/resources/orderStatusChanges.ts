import { HTTPClient } from '../http/client';
import { Configuration } from '../types/generated/src/runtime';
import { OrderStatusChangeApi } from '../types/generated/src/apis/OrderStatusChangeApi';
import type {
  PageOfOrderStatusChanges,
} from '../types/generated/src/models';

export interface OrderStatusChangeListParams {
  page?: number;
  from?: string; // ISO date-time
  to?: string; // ISO date-time
}

/**
 * Order Status Changes resource
 */
export class OrderStatusChangesResource {
  private orderStatusChangeApi: OrderStatusChangeApi;

  constructor(
    private httpClient: HTTPClient,
    config: Configuration
  ) {
    this.orderStatusChangeApi = new OrderStatusChangeApi(config);
  }

  /**
   * List order status changes
   */
  async list(params?: OrderStatusChangeListParams): Promise<PageOfOrderStatusChanges> {
    return this.orderStatusChangeApi.getAppEcommerceApiV2GetorderstatuschangesInvoke(
      params?.page,
      params?.from ? new Date(params.from) : undefined,
      params?.to ? new Date(params.to) : undefined
    );
  }
}

