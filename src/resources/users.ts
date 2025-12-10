import { HTTPClient } from '../http/client';
import { Configuration } from '../types/generated/src/runtime';
import { UserApi } from '../types/generated/src/apis/UserApi';
import type {
  Me,
} from '../types/generated/src/models';

/**
 * Users resource
 */
export class UsersResource {
  private userApi: UserApi;

  constructor(
    private httpClient: HTTPClient,
    config: Configuration
  ) {
    this.userApi = new UserApi(config);
  }

  /**
   * Get current user (validate access token)
   */
  async me(): Promise<Me> {
    return this.userApi.getAppEcommerceApiV2GetmeInvoke();
  }
}

