import { HTTPClient } from '../http/client';
import { Configuration } from '../types/generated/src/runtime';
import { TrackingNumberApi } from '../types/generated/src/apis/TrackingNumberApi';
import type {
  PageOfTrackingNumbers,
} from '../types/generated/src/models';

export interface TrackingNumberListParams {
  page?: number;
  from?: string; // ISO date-time
  to?: string; // ISO date-time
}

/**
 * Tracking Numbers resource
 */
export class TrackingNumbersResource {
  private trackingNumberApi: TrackingNumberApi;

  constructor(
    private httpClient: HTTPClient,
    config: Configuration
  ) {
    this.trackingNumberApi = new TrackingNumberApi(config);
  }

  /**
   * List tracking numbers
   */
  async list(params?: TrackingNumberListParams): Promise<PageOfTrackingNumbers> {
    return this.trackingNumberApi.getAppEcommerceApiV2GettrackingnumbersInvoke(
      params?.page,
      params?.from ? new Date(params.from) : undefined,
      params?.to ? new Date(params.to) : undefined
    );
  }
}

