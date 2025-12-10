import { HTTPClient } from '../http/client';
import { Configuration } from '../types/generated/src/runtime';
import { InvoiceApi } from '../types/generated/src/apis/InvoiceApi';
import type {
  Invoice,
  PageOfInvoices,
} from '../types/generated/src/models';

export interface InvoiceListParams {
  page?: number;
  from?: string; // ISO date-time
  to?: string; // ISO date-time
}

/**
 * Invoices resource
 */
export class InvoicesResource {
  private invoiceApi: InvoiceApi;

  constructor(
    private httpClient: HTTPClient,
    config: Configuration
  ) {
    this.invoiceApi = new InvoiceApi(config);
  }

  /**
   * List invoices
   */
  async list(params?: InvoiceListParams): Promise<PageOfInvoices> {
    return this.invoiceApi.getAppEcommerceApiV2GetinvoicesInvoke(
      params?.page,
      params?.from ? new Date(params.from) : undefined,
      params?.to ? new Date(params.to) : undefined
    );
  }

  /**
   * Retrieve a specific invoice
   */
  async retrieve(invoiceId: string): Promise<Invoice> {
    return this.invoiceApi.getAppEcommerceApiV2GetinvoiceInvoke(invoiceId);
  }
}

