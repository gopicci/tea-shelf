/**
 * Defines brewing data structure.
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
 * Defines origin data structure.
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
 * Defines minimal vendor data structure.
 */
export interface VendorModel {
  /** Vendor name */
  name: string;
}

/**
 * Defines minimal subcategory data structure.
 */
export interface SubcategoryModel {
  /** Subcategory name */
  name: string;
}

/**
 * Defines tea data structure.
 */
export interface TeaModel {
  /** Instance ID */
  id: string;
  /** Tea image */
  image?: string;
  /** Tea name */
  name: string;
  /** Category ID */
  category: number;
  /** Subcategory object */
  subcategory?: SubcategoryModel;
  /** Origin object */
  origin?: OriginModel;
  /** Vendor object */
  vendor?: VendorModel;
  /** Defines if tea is archived */
  is_archived: boolean;
  /** Gongfu brewing object */
  gongfu_brewing?: BrewingModel;
  /** Western brewing object object */
  western_brewing?: BrewingModel;
  /** Tea year */
  year?: number;
  /** Default brewing preference */
  gongfu_preferred: boolean;
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
  created_on: string;
}

/**
 * Defines tea data structure.
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
 * Defines teas sorting options.
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
 * Define filters data structure.
 */
export interface Filters {
  sorting: SortingOptions;
  active: number;
  filters: {
    categories: { [name: string]: boolean };
    subcategories: { [name: string]: boolean };
    vendors: { [name: string]: boolean };
    countries: { [name: string]: boolean };
    regions: { [name: string]: boolean };
    localities: { [name: string]: boolean };
  };
}
