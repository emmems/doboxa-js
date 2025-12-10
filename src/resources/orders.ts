import { HTTPClient } from '../http/client';
import { Configuration } from '../types/generated/src/runtime';
import { OrderApi } from '../types/generated/src/apis/OrderApi';
import { OrderCancellationApi } from '../types/generated/src/apis/OrderCancellationApi';
import type {
  Order,
  OrderStatus,
  PostOrderStatus,
  CreateOrderComment,
  PostOrderCommentResponse,
  PostOrderResponse,
  PostOrderStatusResponse,
  PageOfInvoices,
  PageOfOrderComments,
  PageOfTrackingNumbers,
  OrderCancellation,
  OrderCancellationResponse,
} from '../types/generated/src/models';

export interface OrderCreateParams extends Omit<
  Order,
  'billing_address' | 'order_source' | 'discount_code' | 'partner_code' | 
  'order_original_data' | 'payment_method' | 'payment_transaction_id' | 
  'ag_invoice_requested' | 'suggested_delivery_method'
> {}

export interface OrderStatusUpdateParams extends PostOrderStatus {}

export interface OrderCommentCreateParams extends CreateOrderComment {}

export interface OrderCancelParams {
  order_id: string;
}

/**
 * Orders resource
 */
export class OrdersResource {
  private orderApi: OrderApi;
  private cancellationApi: OrderCancellationApi;

  constructor(
    private httpClient: HTTPClient,
    config: Configuration
  ) {
    this.orderApi = new OrderApi(config);
    this.cancellationApi = new OrderCancellationApi(config);
  }

  /**
   * Create an order
   */
  async create(params: OrderCreateParams): Promise<PostOrderResponse> {
    return this.orderApi.postAppEcommerceApiV2PostorderInvoke(params);
  }

  /**
   * Get current order status
   */
  async getStatus(orderId: string): Promise<OrderStatus> {
    return this.orderApi.getAppEcommerceApiV2GetorderstatusInvoke(orderId);
  }

  /**
   * Update order status
   */
  async updateStatus(
    orderId: string,
    params: OrderStatusUpdateParams
  ): Promise<PostOrderStatusResponse> {
    return this.orderApi.postAppEcommerceApiV2PostorderstatuschangeInvoke(
      orderId,
      params
    );
  }

  /**
   * Get order comments
   */
  async getComments(orderId: string): Promise<PageOfOrderComments> {
    return this.orderApi.getAppEcommerceApiV2GetordercommentsInvoke(orderId);
  }

  /**
   * Create an order comment
   */
  async createComment(
    orderId: string,
    params: OrderCommentCreateParams
  ): Promise<PostOrderCommentResponse> {
    return this.orderApi.postAppEcommerceApiV2PostordercommentInvoke(
      orderId,
      params
    );
  }

  /**
   * Get order invoices
   */
  async getInvoices(orderId: string): Promise<PageOfInvoices> {
    return this.orderApi.getAppEcommerceApiV2GetorderinvoicesInvoke(orderId);
  }

  /**
   * Get order tracking numbers
   */
  async getTrackingNumbers(orderId: string): Promise<PageOfTrackingNumbers> {
    return this.orderApi.getAppEcommerceApiV2GetordertrackingnumbersInvoke(orderId);
  }

  /**
   * Cancel an order
   */
  async cancel(params: OrderCancelParams): Promise<OrderCancellationResponse> {
    const cancellation: OrderCancellation = {
      order_id: params.order_id,
    };
    return this.cancellationApi.postAppEcommerceApiV2PostordercancellationInvoke(
      cancellation
    );
  }
}

