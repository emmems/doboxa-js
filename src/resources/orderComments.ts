import { HTTPClient } from '../http/client';
import { Configuration } from '../types/generated/src/runtime';
import { OrderCommentApi } from '../types/generated/src/apis/OrderCommentApi';
import type {
  PageOfOrderComments,
} from '../types/generated/src/models';

export interface OrderCommentListParams {
  page?: number;
  from?: string; // ISO date-time
  to?: string; // ISO date-time
}

/**
 * Order Comments resource
 */
export class OrderCommentsResource {
  private orderCommentApi: OrderCommentApi;

  constructor(
    private httpClient: HTTPClient,
    config: Configuration
  ) {
    this.orderCommentApi = new OrderCommentApi(config);
  }

  /**
   * List order comments
   */
  async list(params?: OrderCommentListParams): Promise<PageOfOrderComments> {
    return this.orderCommentApi.getAppEcommerceApiV2GetorderscommentsInvoke(
      params?.page,
      params?.from ? new Date(params.from) : undefined,
      params?.to ? new Date(params.to) : undefined
    );
  }
}

