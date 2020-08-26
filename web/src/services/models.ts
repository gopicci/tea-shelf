/**
 * Brewing data structure, used in both gongfu and western brewing instances.
 */
export interface BrewingModel {
  /** Temperature in Celsius degrees */
  temperature?: number;
  /** Weight in grams */
  weight?: number;
  /** Initial brewing time in HH:MM:SS format */
  initial?: string;
  /** Successive brewings increment time in HH:MM:SS format */
  increments?: string;
}

/**
 * Origin data structure.
 */
export interface OriginModel {
  /** Country name */
  country: string;
  /** Region name */
  region?: string;
  /** Locality name */
  locality?: string;
  /** Latitude degrees */
  latitude?: number;
  /** Longitude degrees */
  longitude?: number;
}

/**
 * Vendor instance data structure.
 */
export interface VendorModel {
  /** Vendor name */
  name: string;
  /** Vendor ID */
  id: number;
  /** Vendor website */
  website?: string;
  /** Vendor origin */
  origin?: OriginModel;
  /** Vendor popularity */
  popularity?: number;
}

/**
 * Subcategory instance data structure.
 */
export interface SubcategoryModel {
  /** Subcategory name */
  name: string;
  /** Subcategory ID */
  id: number;
  /** Macro category */
  category: number;
  /** English name */
  translated_name?: string;
  /** Origin */
  origin?: OriginModel;
  /** Gongfu brewing object */
  gongfu_brewing?: BrewingModel;
  /** Western brewing object object */
  western_brewing?: BrewingModel;
  /** Description */
  description?: string;
  /** Description source website */
  description_source?: string;
}

/**
 * Defines structure of a tea creation request.
 */
export interface TeaRequest {
  /** Tea name */
  name: string;
  /** Category ID */
  category: number;
  /** Tea image */
  image?: string;
  /** Subcategory object */
  subcategory?: SubcategoryModel;
  /** Origin object */
  origin?: OriginModel;
  /** Vendor object */
  vendor?: VendorModel;
  /** Defines if tea is archived */
  is_archived?: boolean;
  /** Gongfu brewing object */
  gongfu_brewing?: BrewingModel;
  /** Western brewing object object */
  western_brewing?: BrewingModel;
  /** Tea year */
  year?: number;
  /** Default brewing preference */
  gongfu_preferred?: boolean;
  /** Price per gram */
  price?: number;
  /** Weight left */
  weight_left?: number;
  /** Weight consumed */
  weight_consumed?: number;
  /** Rating */
  rating?: number;
  /** Notes */
  notes?: string;
  /** Creation date */
  created_on?: string;
}

/**
 * Tea instance data structure.
 */
export interface TeaModel extends TeaRequest {
  /** Instance ID, UUID string if coming from API, number if generated offline */
  id: string | number;
}

/**
 * Category data structure.
 */
export interface CategoryModel {
  /** Instance ID */
  id: number;
  /** Tea name */
  name: string;
  /** Gongfu brewing object */
  gongfu_brewing?: BrewingModel;
  /** Western brewing object object */
  western_brewing?: BrewingModel;
  /** Description */
  description?: string;
  /** Description source website */
  description_source?: string;
}

/**
 * Defines sorting options.
 */
export interface SortingOptions {
  /** Sort by date added */
  "date added": boolean;
  /** Sort by tea year */
  year: boolean;
  /** Sort by user rating */
  rating: boolean;
  /** Sort by tea name alphabetically */
  alphabetical: boolean;
  /** Sort by tea origin alphabetically */
  origin: boolean;
  /** Sort by tea vendor alphabetically */
  vendor: boolean;
  /** Key must be string */
  [key: string]: boolean;
}

/**
 * Filters and sorting data structure.
 */
export interface Filters {
  /** Sorting options */
  sorting: SortingOptions;
  /** Active filter status */
  active: number;
  /** Filter groups */
  filters: {
    categories: { [name: string]: boolean };
    subcategories: { [name: string]: boolean };
    vendors: { [name: string]: boolean };
    countries: { [name: string]: boolean };
    regions: { [name: string]: boolean };
    localities: { [name: string]: boolean };
  };
}

/**
 * Vision parser response data structure.
 */
export interface VisionData {
  /** Supposed tea name */
  name?: string;
  /** Supposed tea year */
  year?: string;
  /** Supposed tea category */
  category?: string;
  /** Supposed tea subcategory */
  subcategory?: string;
  /** Supposed tea vendor */
  vendor?: string;
}