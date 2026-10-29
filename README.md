# Doboxa JS

A library for interacting with the Doboxa API v2. This library provides a clean interface for all Doboxa API endpoints.

## Prerequisites

Before using this library, you need to:

1. **Contact the Doboxa team** at [doboxa.com](https://doboxa.com) to request API access for your account
2. Have your Doboxa account **username and password** ready (these are your regular Doboxa account credentials)

## Installation

```bash
npm install doboxa-js
# or
pnpm add doboxa-js
# or
yarn add doboxa-js
```

## Quick Start

### Basic Setup

```typescript
import Doboxa from "doboxa-js";

// Initialize the client
const doboxa = new Doboxa({
  baseURL: "https://pl.doboxa.biz", // Optional: defaults to DOBOXA_API_URL env var or https://pl.doboxa.biz
});
```

### Authentication

The library supports two authentication methods:

#### Method 1: Login with Username and Password

```typescript
import Doboxa from "doboxa-js";

const doboxa = new Doboxa({
  baseURL: "https://pl.doboxa.biz",
});

// Login with your Doboxa account credentials
const authResponse = await doboxa.authentication.login({
  username: "your-username",
  password: "your-password",
});

console.log("Access token:", authResponse.token);
console.log("Refresh token:", authResponse.refresh_token);

// Tokens are automatically stored and used for subsequent requests
```

#### Method 2: Initialize with Access Token

If you already have an access token:

```typescript
import Doboxa from "doboxa-js";

const doboxa = new Doboxa({
  apiKey: "your-access-token",
  baseURL: "https://pl.doboxa.biz",
});

// You can now make API calls immediately
```

**Note:** The library automatically handles token refresh when tokens expire. If you're using username/password authentication, the refresh token will be used automatically.

## Usage Examples

### Orders

#### Create an Order

```typescript
const order = await doboxa.orders.create({
  external_id: "ORDER-12345",
  deliver_address: {
    first_name: "John",
    last_name: "Doe",
    phone_number: "+48123456789",
    email: "john.doe@example.com",
    address1: "123 Main St",
    city: "Warsaw",
    post_code: "00-001",
    country_iso: "PL",
  },
  items: [
    {
      id: "SKU-123",
      name: "Product Name",
      qty: 2,
      item_price: 9999, // Price in cents (99.99)
    },
  ],
  order_time: new Date().toISOString(),
  order_channel: "channel_id",
  currency: "PLN",
});
```

#### Get Order Status

```typescript
const status = await doboxa.orders.getStatus("order-id-123");
console.log("Order status:", status.status);
console.log("Item statuses:", status.item_status);
```

#### Update Order Status

```typescript
await doboxa.orders.updateStatus("order-id-123", {
  status: "paid",
  item_status: [
    {
      doboxa_item_id: "item-123",
      status: "paid",
    },
  ],
});
```

#### Get Order Comments

```typescript
const comments = await doboxa.orders.getComments("order-id-123");
console.log("Comments:", comments.items);
```

#### Create Order Comment

```typescript
const comment = await doboxa.orders.createComment("order-id-123", {
  author_type: "client",
  author_email: "client@example.com",
  content: "This is a comment",
  created_at: new Date().toISOString(),
});
```

#### Get Order Invoices

```typescript
const invoices = await doboxa.orders.getInvoices("order-id-123");
console.log("Invoices:", invoices.items);
```

#### Get Order Tracking Numbers

```typescript
const tracking = await doboxa.orders.getTrackingNumbers("order-id-123");
console.log("Tracking numbers:", tracking.items);
```

#### Cancel an Order

```typescript
const result = await doboxa.orders.cancel({
  order_id: "order-id-123",
});
console.log("Cancelled:", result.cancelled);
console.log("Details:", result.details);
```

### Invoices

#### List Invoices

```typescript
const invoices = await doboxa.invoices.list({
  page: 1,
  from: "2024-01-01T00:00:00Z", // Optional: ISO date-time string
  to: "2024-12-31T23:59:59Z", // Optional: ISO date-time string
});

console.log("Invoices:", invoices.items);
console.log("Next page:", invoices.next_page);
```

#### Retrieve a Specific Invoice

```typescript
const invoice = await doboxa.invoices.retrieve("invoice-id-123");
console.log("Invoice:", invoice);
console.log("PDF URL:", invoice.file);
```

### Clients

#### List Clients

```typescript
const clients = await doboxa.clients.list({
  page: 1,
});

console.log("Clients:", clients.items);
```

### Discount Codes

#### List Discount Codes

```typescript
const discountCodes = await doboxa.discountCodes.list({
  page: 1,
});

console.log("Discount codes:", discountCodes.items);
```

### Tracking Numbers

#### List Tracking Numbers

```typescript
const trackingNumbers = await doboxa.trackingNumbers.list({
  page: 1,
  from: "2024-01-01T00:00:00Z",
  to: "2024-12-31T23:59:59Z",
});

console.log("Tracking numbers:", trackingNumbers.items);
```

### Order Comments

#### List Order Comments

```typescript
const comments = await doboxa.orderComments.list({
  page: 1,
  from: "2024-01-01T00:00:00Z",
  to: "2024-12-31T23:59:59Z",
});

console.log("Comments:", comments.items);
```

### Order Status Changes

#### List Order Status Changes

```typescript
const statusChanges = await doboxa.orderStatusChanges.list({
  page: 1,
  from: "2024-01-01T00:00:00Z",
  to: "2024-12-31T23:59:59Z",
});

console.log("Status changes:", statusChanges.items);
```

### Users

#### Get Current User

```typescript
const me = await doboxa.users.me();
console.log("Current user:", me.username);
```

### Product catalog (BaseLinker connector)

The product catalog is not part of API v2 - it is served by Doboxa's BaseLinker
connector (shop integration file) on its own URL. The merchant finds both
credentials in the Doboxa client panel: **Integracje → Edycja** on the BaseLinker
integration. The modal shows the connector URL and the **Hasło** (password)
field.

```typescript
const doboxa = new Doboxa({
  baseURL: "https://pl.doboxa.biz",
  catalog: {
    url: "https://pl.doboxa.biz/api/base-linker/{clientToken}/{language}",
    password: "YOUR_BL_PASS",
  },
});
const catalog = doboxa.catalog!; // defined because `catalog` config was passed

// Connector capabilities
console.log(await catalog.fileVersion());
console.log(await catalog.supportedMethods());

// Categories: { "<id>": "Category / Path" }
const categories = await catalog.categories();

// One page of designs (100 per page)
const { pages, items } = await catalog.list({ page: 1 });
console.log(pages, items[0].id, items[0].name, items[0].price);

// Full data (images, variants) for selected designs
const data = await catalog.data({
  products_id: [items[0].id],
});
```

Notes:

- The catalog uses only the connector password, so no `apiKey` is needed - the
  client works with the catalog, with the API and with both.
- `list()` returns one entry per design (the first variant); `data()` returns
  the design with all of its variants.
- Prices are strings in PLN (up to 3 decimals) and are most likely **net**
  prices - the markup is set by the merchant in the panel ("Zarządzanie cenami").
- The connector has no order methods, so orders are still created through
  API v2 (`doboxa.orders`).
- Connector errors are returned with HTTP 200 and are thrown as
  `DoboxaConnectorError` (with `errorCode` and `errorText`).

## Environment Variables

You can set the API base URL using an environment variable:

```bash
export DOBOXA_API_URL=https://pl.doboxa.biz
```

The library will use this value if no `baseURL` is provided in the configuration.

## Error Handling

The library provides structured error classes:

```typescript
import {
  DoboxaError,
  DoboxaAPIError,
  DoboxaAuthenticationError,
  DoboxaValidationError,
} from "doboxa-js";

try {
  await doboxa.orders.create(orderData);
} catch (error) {
  if (error instanceof DoboxaAuthenticationError) {
    console.error("Authentication failed:", error.message);
  } else if (error instanceof DoboxaValidationError) {
    console.error("Validation error:", error.message);
    console.error("Invalid parameters:", error.invalidParameters);
  } else if (error instanceof DoboxaAPIError) {
    console.error("API error:", error.statusCode, error.message);
  } else {
    console.error("Unknown error:", error);
  }
}
```

## TypeScript Support

This library is written in TypeScript and provides full type definitions. All API responses and request parameters are fully typed:

```typescript
import type {
  Order,
  Invoice,
  OrderStatus,
  PageOfInvoices,
  // ... and many more
} from "doboxa-js";
```

## API Reference

### Resources

- **Authentication**: `doboxa.authentication`

  - `login(params)` - Login with username and password
  - `refreshToken(refreshToken)` - Refresh access token

- **Orders**: `doboxa.orders`

  - `create(params)` - Create an order
  - `getStatus(orderId)` - Get order status
  - `updateStatus(orderId, params)` - Update order status
  - `getComments(orderId)` - Get order comments
  - `createComment(orderId, params)` - Create order comment
  - `getInvoices(orderId)` - Get order invoices
  - `getTrackingNumbers(orderId)` - Get order tracking numbers
  - `cancel(params)` - Cancel an order

- **Invoices**: `doboxa.invoices`

  - `list(params?)` - List invoices
  - `retrieve(invoiceId)` - Get a specific invoice

- **Clients**: `doboxa.clients`

  - `list(params?)` - List clients

- **Discount Codes**: `doboxa.discountCodes`

  - `list(params?)` - List discount codes

- **Tracking Numbers**: `doboxa.trackingNumbers`

  - `list(params?)` - List tracking numbers

- **Order Comments**: `doboxa.orderComments`

  - `list(params?)` - List order comments

- **Order Status Changes**: `doboxa.orderStatusChanges`

  - `list(params?)` - List order status changes

- **Users**: `doboxa.users`
  - `me()` - Get current user

- **Catalog**: `doboxa.catalog` (only when the `catalog` config is provided)
  - `fileVersion()` - Get the connector platform and version
  - `supportedMethods()` - Get the list of supported actions
  - `categories()` - Get all product categories
  - `list(params?)` - List one page of products (designs)
  - `data(params)` - Get full product data (images, variants) for design ids

## License

ISC

## Support

For API access and support, please contact the Doboxa team at [doboxa.com](https://doboxa.com).
