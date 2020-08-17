import { brewingTimesToSeconds } from "./ParsingService";

// Defines brewing data structure in API request format
export const brewingModel = {
  temperature: null,
  weight: null,
  initial: null,
  increments: null,
};

// Defines origin data structure in API request format
export const originModel = {
  country: null,
  region: null,
  locality: null,
  latitude: null,
  longitude: null,
};

// Defines vendor data structure in API request format
export const vendorModel = {
  name: null,
};

// Defines subcategory data structure in API request format
export const subcategoryModel = {
  name: null,
};

// Defines tea data structure in API request format
export const teaModel = {
  id: null,
  image: null,
  name: "",
  category: null,
  subcategory: subcategoryModel,
  origin: originModel,
  vendor: vendorModel,
  is_archived: false,
  gongfu_brewing: brewingModel,
  western_brewing: brewingModel,
  year: null,
  gongfu_preferred: false,
  price: null,
  weight_left: null,
  weight_consumed: null,
  rating: null,
  notes: "",
};

export function teaSerializer(tea) {
  /**
   * Serialize tea object data to fit an API request
   *
   * @param tea {json} Tea object
   */
  let serialized = {};

  // Drop non model entries
  for (const k of Object.keys(teaModel))
    if (tea[k] != null) serialized[k] = tea[k];

  if (
    serialized.year &&
    typeof serialized.year === "string" &&
    serialized.year.toLowerCase() === "unknown"
  )
    serialized.year = null;

  // Serialize nested fields
  if (brewingSerializer(tea.gongfu_brewing))
    serialized.gongfu_brewing = brewingSerializer(tea.gongfu_brewing);
  if (brewingSerializer(tea.western_brewing))
    serialized.western_brewing = brewingSerializer(tea.western_brewing);
  if (tea.origin && tea.origin.country)
    serialized.origin = originSerializer(tea.origin);
  if (tea.subcategory && tea.subcategory.name)
    serialized.subcategory = {
      name: tea.subcategory.name,
      category: tea.category,
    };
  if (tea.vendor && tea.vendor.name)
    serialized.vendor = { name: tea.vendor.name };

  return Object.keys(serialized).length === 0 ? null : serialized;
}

function brewingSerializer(brewing) {
  /**
   * Serialize brewing object data to fit an API request
   *
   * @param brewing {json} Brewing object
   */
  let serialized = {};
  for (const k of Object.keys(brewingModel))
    if (brewing[k]) serialized[k] = brewing[k];
  return Object.keys(serialized).length === 0 ? null : serialized;
}

function originSerializer(origin) {
  /**
   * Serialize origin object data to fit an API request
   *
   * @param origin {json} Origin object
   */
  let serialized = {};
  for (const k of Object.keys(originModel))
    if (origin[k]) {
      const value = origin[k];
      if (typeof value === "string")
        serialized[k] = value.replace("&#39;", "'");
      else serialized[k] = value;
    }

  return Object.keys(serialized).length === 0 ? null : serialized;
}

export function visionParserSerializer(
  data,
  categories,
  subcategories,
  vendors
) {
  /**
   * Serialize vision parser response to fit in tea object
   *
   * @param data {json} Vision parser response
   * @param categories {json} Categories state
   * @param subcategories {json} Subcategories state
   * @param vendors {json} Vendors state
   */
  let serialized = {};

  if (data.name) serialized.name = data.name;

  if (data.year) serialized.year = data.year;

  if (data.category)
    serialized.category = Object.entries(categories).find(
      (entry) => entry[1].name === data.category
    )[1].id;

  if (data.subcategory) {
    const subcategory = Object.entries(subcategories).find(
      (entry) => entry[1].name === data.subcategory
    )[1];

    serialized.subcategory = subcategory;

    if (subcategory.origin) serialized.origin = subcategory.origin;

    if (subcategory.western_brewing)
      serialized.western_brewing = brewingTimesToSeconds(
        subcategory.western_brewing
      );

    if (subcategory.gongfu_brewing)
      serialized.gongfu_brewing = brewingTimesToSeconds(
        subcategory.gongfu_brewing
      );
  }

  if (data.vendor)
    serialized.vendor = Object.entries(vendors).find(
      (entry) => entry[1].name === data.vendor
    )[1];

  return Object.keys(serialized).length === 0 ? null : serialized;
}
