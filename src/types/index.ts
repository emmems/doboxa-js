// Re-export all generated types
export * from '../types/generated/src/models';

// Re-export convenience types from resources
export type {
  LoginParams,
  RefreshTokenParams,
} from '../resources/authentication';

export type {
  OrderCreateParams,
  OrderStatusUpdateParams,
  OrderCommentCreateParams,
  OrderCancelParams,
} from '../resources/orders';

export type {
  InvoiceListParams,
} from '../resources/invoices';

export type {
  ClientListParams,
} from '../resources/clients';

export type {
  DiscountCodeListParams,
} from '../resources/discountCodes';

export type {
  TrackingNumberListParams,
} from '../resources/trackingNumbers';

export type {
  OrderCommentListParams,
} from '../resources/orderComments';

export type {
  OrderStatusChangeListParams,
} from '../resources/orderStatusChanges';

// Re-export configuration types
export type { DoboxaConfig } from '../client';

// Convenience type aliases for common enums
export type OrderStatusEnum =
  | 'new'
  | 'wait_for_payment'
  | 'paid'
  | 'in_progress'
  | 'ready_to_be_sent'
  | 'sent'
  | 'cancelled'
  | 'hold'
  | 'refund';

export type InvoiceStateEnum = 'PAID' | 'UNPAID';

export type AuthorTypeEnum = 'client' | 'support';

