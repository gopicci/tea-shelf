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
}
