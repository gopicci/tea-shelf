/**
 * User data structure, as in auth token payload.
 */
export interface UserAuth {
  /** User email */
  email: string;
  /** Token expiration date */
  exp: number;
  /** User ID */
  id: string;
  /** Account active status */
  is_active: boolean;
  /** Registration date */
  joined_at: string;
  /** JWT token ID */
  jti: string;
  /** Last login date */
  last_login: string;
  /** JWT token type */
  token_type: string;
}

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
 * Extending brewing model to include extra fields needed in forms.
 */
interface FormBrewingModel extends BrewingModel {
  /** Fahrenheit or celsius measure switch */
  fahrenheit: boolean;
}

/**
 * Brewing session data structure.
 */
export interface SessionModel {
  /** API instance ID as UUID string */
  id?: string;
  /** Optional ID of the tea being used */
  tea?: string;
  /** Optional name for the session */
  name?: string;
  /** Session brewing details */
  brewing: BrewingModel;
  /** Creation date */
  created_on: string;
  /** Date of last brewing */
  last_brewed_on: string;
  /** Current infusion number */
  current_infusion: number;
  /** Completion status */
  is_completed: boolean;
}

/**
 * Extension of SessionModel that defines a session instance,
 * with required ID.
 */
export interface SessionInstance extends SessionModel {
  /** Instance ID used for offline operations */
  offline_id: number;
}

/**
 * Clock data structure, represents brewing sessions currently running.
 */
export interface Clock {
  /** Brewing session instance offline ID */
  offline_id: number;
  /** Brewing starting time as Date.now() milliseconds */
  starting_time: number;
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
 * Vendor request data structure.
 */
export interface VendorModel {
  /** Vendor name */
  name: string;
  /** Vendor API ID */
  id?: number;
  /** Vendor website */
  website?: string;
  /** Vendor origin */
  origin?: OriginModel;
  /** Vendor popularity */
  popularity?: number;
}

/**
 * Vendor instance data structure with required offline ID.
 */
export interface VendorInstance extends VendorModel {
  /** Vendor instance ID, used for offline operations */
  offline_id: number;
}

/**
 * Subcategory request data structure.
 */
export interface SubcategoryModel {
  /** Subcategory name */
  name: string;
  /** Subcategory ID */
  id?: number;
  /** Macro category */
  category?: number;
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
 * * Subcategory instance data structure with required offline ID.
 */
export interface SubcategoryInstance extends SubcategoryModel {
  /** Subcategory instance ID, used for offline operations */
  offline_id: number;
}

/**
 * Defines a lazy structure of a tea, mimicking all API model fields but without requirements.
 */
export interface TeaModel {
  /** API instance ID as UUID string */
  id?: string;
  /** Tea name */
  name?: string;
  /** Category ID */
  category?: number;
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
  year?: number | null;
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
  /** Enabling string indexing */
  [index: string]: any;
}

/**
 * Extension of TeaModel that defines a tea creation request,
 * requiring name and category.
 */
export interface TeaRequest extends TeaModel {
  /** Tea name */
  name: string;
  /** Category ID */
  category: number;
}

/**
 * Extension of TeaRequest that defines a tea instance,
 * with required offline ID.
 */
export interface TeaInstance extends TeaRequest {
  /** Tea instance ID, used for offline operations */
  offline_id: number;
}

/**
 * Extension of tea model that includes extra fields needed in input forms.
 */
export interface InputFormModel extends TeaInstance {
  /** Brewing type, follows API naming convention */
  brewing_type: "gongfu_brewing" | "western_brewing";
  /** Gongfu brewing model includes measure */
  gongfu_brewing: FormBrewingModel;
  /** Western brewing model includes measure */
  western_brewing: FormBrewingModel;
  /** Weight measure */
  measure: "g" | "oz";
  /** Enabling string indexing */
  [index: string]: any;
}

/**
 * Category instance data structure. Offline instances use
 * same ID as API as categories are not mutable.
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
  /** Sorting reverse status */
  reversed: boolean;
  /** Number of active filters */
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
  year?: number;
  /** Supposed tea category ID */
  category?: number;
  /** Supposed tea subcategory ID */
  subcategory?: number;
  /** Supposed tea vendor ID */
  vendor?: number;
}

/**
 * User settings data structure.
 */
export interface Settings {
  /** Grid view or list view on desktop mode */
  gridView?: boolean;
  /** Metric units or imperial */
  metric?: boolean;
  /** Gongfu brewing or western */
  gongfu?: boolean;
  /** Vibrate on timer completion on mobile */
  vibration?: boolean;
}

/**
 * Confirmation dialog structure.
 */
export interface Confirmation {
  /** Confirmation message */
  message: string;
  /** Confirmation action callback */
  callback: () => void;
}
