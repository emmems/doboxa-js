import { DoboxaConnectorError } from '../errors';
import type {
  BaseLinkerAction,
  BaseLinkerConnectorConfig,
  BaseLinkerError,
  FileVersionResponse,
  ProductData,
  ProductsCategoriesResponse,
  ProductsDataParams,
  ProductsDataResponse,
  ProductsListEntry,
  ProductsListParams,
  ProductsListResponse,
  ProductsListResult,
  SupportedMethodsResponse,
} from '../types/catalog';

/**
 * Product catalog resource.
 *
 * Wraps Doboxa's BaseLinker connector (shop integration file). The connector is
 * a separate API: it lives on its own URL, takes a form body and reports errors
 * with HTTP 200, so it is called directly instead of through the generated
 * API v2 client.
 */
export class CatalogResource {
  constructor(private config: BaseLinkerConnectorConfig) {}

  /**
   * Call a connector action.
   *
   * @param action - Connector action, e.g. "ProductsList"
   * @param params - Additional action parameters
   * @throws DoboxaConnectorError on HTTP or connector errors
   */
  private async call<T>(
    action: BaseLinkerAction,
    params: Record<string, string> = {}
  ): Promise<T> {
    const response = await fetch(this.config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        bl_pass: this.config.password,
        action,
        ...params,
      }),
    });

    if (!response.ok) {
      throw new DoboxaConnectorError(
        `http_${response.status}`,
        response.statusText || 'Unexpected HTTP status',
        `BaseLinker connector request failed with HTTP ${response.status}`
      );
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new DoboxaConnectorError(
        'invalid_response',
        'Connector response is not valid JSON',
        'BaseLinker connector returned a non-JSON response'
      );
    }

    if (
      payload !== null &&
      typeof payload === 'object' &&
      !Array.isArray(payload) &&
      (payload as BaseLinkerError).error === true
    ) {
      const error = payload as BaseLinkerError;
      throw new DoboxaConnectorError(error.error_code, error.error_text);
    }

    return payload as T;
  }

  /**
   * Get the connector platform and version.
   */
  async fileVersion(): Promise<FileVersionResponse> {
    return this.call<FileVersionResponse>('FileVersion');
  }

  /**
   * Get the list of actions the connector supports.
   */
  async supportedMethods(): Promise<SupportedMethodsResponse> {
    return this.call<SupportedMethodsResponse>('SupportedMethods');
  }

  /**
   * Get all product categories as a map of category id to category path.
   */
  async categories(): Promise<ProductsCategoriesResponse> {
    return this.call<ProductsCategoriesResponse>('ProductsCategories');
  }

  /**
   * List one page of products (designs).
   *
   * @param params - Page number and optional category filter
   */
  async list(params: ProductsListParams = {}): Promise<ProductsListResult> {
    const response = await this.call<ProductsListResponse>('ProductsList', {
      page: String(params.page ?? 1),
      ...(params.category_id !== undefined ? { category_id: params.category_id } : {}),
    });

    const items: ProductsListEntry[] = [];
    for (const id of Object.keys(response)) {
      if (id === 'pages') {
        continue;
      }
      const value = response[id];
      if (typeof value !== 'object' || value === null) {
        continue;
      }
      items.push({ id, ...value });
    }

    return { pages: response.pages, items };
  }

  /**
   * Get full product data (images, variants) for the given design ids.
   *
   * @param params - Design ids from the product list
   */
  async data(params: ProductsDataParams): Promise<Record<string, ProductData>> {
    const response = await this.call<ProductsDataResponse>('ProductsData', {
      products_id: params.products_id.join(','),
    });

    // The connector answers with an empty PHP array (parsed as []) when nothing matches.
    return Array.isArray(response) ? {} : response;
  }
}
