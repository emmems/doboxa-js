// ---- request ----

/**
 * Actions supported by Doboxa's BaseLinker connector.
 */
export type BaseLinkerAction =
  | 'FileVersion'
  | 'SupportedMethods'
  | 'ProductsCategories'
  | 'ProductsList'
  | 'ProductsData';

/**
 * Credentials of Doboxa's BaseLinker connector (shop integration file).
 */
export interface BaseLinkerConnectorConfig {
  /**
   * Connector URL, e.g. https://pl.doboxa.biz/api/base-linker/{clientToken}/{language}
   */
  url: string;
  /**
   * "Hasło" of the integration in the Doboxa client panel
   */
  password: string;
}

/**
 * Parameters of a `ProductsList` call.
 */
export interface ProductsListParams {
  /**
   * 1-based; past the end returns only `pages`
   */
  page?: number;
  /**
   * Filter the list by a single category id
   */
  category_id?: string;
}

/**
 * Parameters of a `ProductsData` call.
 */
export interface ProductsDataParams {
  /**
   * Design (parent) ids from ProductsList
   */
  products_id: string[];
}

// ---- responses ----

/**
 * Error body returned by the connector with HTTP 200.
 */
export interface BaseLinkerError {
  error: true;
  error_code: 'no_password' | 'bad_password' | 'unsupported_method' | (string & {});
  error_text: string;
}

/**
 * Connector platform and version.
 */
export interface FileVersionResponse {
  /**
   * e.g. "Magento"
   */
  platform: string;
  /**
   * e.g. "4.1.91"
   */
  version: string;
  /**
   * e.g. 4
   */
  standard: number;
}

/**
 * List of actions the connector supports.
 */
export type SupportedMethodsResponse = BaseLinkerAction[];

/**
 * Category id -> "Fototapety / Tematyka / Abstrakcja"
 */
export type ProductsCategoriesResponse = Record<string, string>;

/**
 * First variant of a design, as shown in the list.
 */
export interface ProductsListItem {
  /**
   * e.g. "Fototapeta Wikingowie I Smoki Flizelina 90x60"
   */
  name: string;
  /**
   * e.g. 999
   */
  quantity: number;
  /**
   * e.g. "20.244" - PLN, probably net
   */
  price: string;
  /**
   * e.g. "FT-2385-VE90-60"
   */
  sku: string;
  /**
   * e.g. "5905451113260"
   */
  ean: string;
}

/**
 * A single product of a list page, with its design id.
 */
export interface ProductsListEntry extends ProductsListItem {
  /**
   * Design (parent) product id
   */
  id: string;
}

/**
 * A page of the product list.
 */
export interface ProductsListResult {
  /**
   * Total number of pages
   */
  pages: number;
  /**
   * Products of the requested page
   */
  items: ProductsListEntry[];
}

/**
 * Raw `ProductsList` response; keys are product ids and `pages` is the total page count.
 */
export type ProductsListResponse = { pages: number } & {
  [productId: string]: ProductsListItem | number;
};

/**
 * [name, value] pair.
 */
export type ProductFeature = [name: ProductFeatureName | (string & {}), value: string | null];

/**
 * Known feature names returned by the connector.
 */
export type ProductFeatureName =
  | 'product_type' // "Fototapeta"
  | 'material' // "Flizelina" | "Flizelina zmywalna" | "Vinyl gładki" | "Vinyl strukturalny" | "Tapeta samoprzylepna"
  | 'dimensions' // "90x60"
  | 'dimensions_width' // "90" (cm)
  | 'dimensions_height' // "60" (cm)
  | 'size_code' // "VE90-60"
  | 'area_m2' // "0.54"
  | 'number_of_elements' // "1"
  | 'break_width'
  | 'break_height'
  | 'weight_gross' // "1.14" (kg)
  | 'weight_nett'
  | 'grammage' // "130"
  | 'lamination' // "Nie"
  | 'printing_technique' // "Brak"
  | 'structure' // "BRAK"
  | 'length' // null
  | 'category_name';

/**
 * A single variant (size x material) of a design.
 */
export interface ProductVariant {
  /**
   * Design name without size/material
   */
  full_name: string;
  /**
   * e.g. "… Flizelina 90x60"
   */
  name: string;
  /**
   * HTML/plain text
   */
  description: string;
  /**
   * Size code: "VE90-60", "VEM", "V4", "brak", …
   */
  rozmiar: string;
  quantity: number;
  /**
   * e.g. "20.244"
   */
  price: string;
  ean: string;
  /**
   * e.g. "FT-2385-VE90-60"
   */
  sku: string;
  features: ProductFeature[];
  /**
   * [0] main image, [1] size render, then mask and room shots
   */
  images: string[];
  category_id: string;
  /**
   * e.g. "Fototapety/Tematyka/Dziecięce/Dla chłopca"
   */
  category_name: string;
}

/**
 * Parent (design) of a product. Its sku/ean/description are empty and its price
 * is "0.00" - use the variants for the real values.
 */
export interface ProductData {
  sku: string;
  ean: string;
  /**
   * e.g. "0.00"
   */
  price: string;
  /**
   * e.g. "1.14"
   */
  weight: string;
  description: string;
  /**
   * Category path
   */
  description_extra1: string;
  /**
   * e.g. "Fototapeta Wikingowie I Smoki"
   */
  name: string;
  quantity: number;
  /**
   * e.g. "Doboxa"
   */
  man_name: string;
  features: ProductFeature[];
  images: string[];
  category_id: string;
  category_name: string;
  /**
   * Variant product id -> variant
   */
  variants: Record<string, ProductVariant>;
}

/**
 * Raw `ProductsData` response; keys are design ids.
 */
export type ProductsDataResponse = Record<string, ProductData> | [];
