import { HTTPClient } from '../http/client';
import { Configuration } from '../types/generated/src/runtime';
import { DiscountCodeApi } from '../types/generated/src/apis/DiscountCodeApi';
import type {
  GetApiV2DiscountCodesExternal200Response,
} from '../types/generated/src/models';

export interface DiscountCodeListParams {
  page?: number;
}

/**
 * Discount Codes resource
 */
export class DiscountCodesResource {
  private discountCodeApi: DiscountCodeApi;

  constructor(
    private httpClient: HTTPClient,
    config: Configuration
  ) {
    this.discountCodeApi = new DiscountCodeApi(config);
  }

  /**
   * List discount codes (only commission type)
   */
  async list(params?: DiscountCodeListParams): Promise<GetApiV2DiscountCodesExternal200Response> {
    return this.discountCodeApi.getApiV2DiscountCodesExternal(params?.page);
  }
}

