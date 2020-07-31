// Defines tea data structure in API request format
export const teaModel = {
  id: null,
  image: null,
  name: "",
  category: null,
  subcategory: null,
  origin: null,
  vendor: null,
  is_archived: false,
  gongfu_brewing: null,
  western_brewing: null,
  year: null,
  gongfu_preferred: false,
  price: null,
  weight_left: null,
  weight_consumed: null,
  rating: null,
  notes: "",
};

// Defines brewing data structure in API request format
const brewingModel = {
  temperature: null,
  weight: null,
  initial: null,
  increments: null,
};

// Defines origin data structure in API request format
const originModel = {
  country: null,
  region: null,
  locality: null,
};

export function teaSerializer(tea) {
  /**
   * Serializes tea object data to fit an API request
   *
   * @param tea {json} Tea object
   */
  let serialized = {};

  // Drop non model entries
  for (const k of Object.keys(teaModel)) if (tea[k] != null) serialized[k] = tea[k];

  if (serialized.year === "unknown") serialized.year = null;

  // Serialize nested fields
  if (tea.gongfu_brewing)
    serialized.gongfu_brewing = brewingSerializer(tea.gongfu_brewing);
  if (tea.western_brewing)
    serialized.western_brewing = brewingSerializer(tea.western_brewing);
  if (tea.origin) serialized.origin = originSerializer(tea.origin);
  if (tea.subcategory)
    serialized.subcategory = {
      name: tea.subcategory.name,
      category: tea.category,
    };
  if (tea.vendor) serialized.vendor = { name: tea.vendor.name };

  return serialized;
}

function brewingSerializer(brewing) {
  /**
   * Serializes brewing object data to fit an API request
   *
   * @param brewing {json} Brewing object
   */
  let serialized = {};
  for (const k of Object.keys(brewingModel))
    if (brewing[k]) serialized[k] = brewing[k];
  return serialized;
}

function originSerializer(origin) {
  /**
   * Serializes origin object data to fit an API request
   *
   * @param origin {json} Origin object
   */
  let serialized = {};
  for (const k of Object.keys(originModel))
    if (origin[k]) serialized[k] = origin[k];
  return serialized;
}
