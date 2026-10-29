// Main client export
import { Doboxa } from './client';
export { Doboxa } from './client';
export type { DoboxaConfig } from './client';

// Error exports
export {
  DoboxaError,
  DoboxaAPIError,
  DoboxaAuthenticationError,
  DoboxaValidationError,
  DoboxaConnectorError,
  parseErrorResponse,
} from './errors';

// Type exports
export * from './types';

// Resource exports (for advanced usage)
export { AuthenticationResource } from './resources/authentication';
export { OrdersResource } from './resources/orders';
export { InvoicesResource } from './resources/invoices';
export { ClientsResource } from './resources/clients';
export { DiscountCodesResource } from './resources/discountCodes';
export { TrackingNumbersResource } from './resources/trackingNumbers';
export { OrderCommentsResource } from './resources/orderComments';
export { OrderStatusChangesResource } from './resources/orderStatusChanges';
export { UsersResource } from './resources/users';
export { CatalogResource } from './resources/catalog';

// Default export
export default Doboxa;

