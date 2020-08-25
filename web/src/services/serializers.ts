import { brewingTimesToSeconds } from "./parsing-services";
import {CategoryModel, SubcategoryModel, BrewingModel, VendorModel, OriginModel, TeaModel, VisionData} from './models';

/**
 * Serializes tea object data to fit an API request.
 *
 * @param tea {Object} Tea object

export function teaSerializer(tea: any) {
  let serialized = tea;

  // Drop non model entries
  for (const k of Object.keys(TeaModel))
    if (tea[k] != null) serialized[k] = tea[k];

  // Drop year if selected entry is "Unknown"
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

/**
 * Serializes brewing object data to fit an API request.
 *
 * @param brewing {Object} Brewing object

function brewingSerializer(brewing) {
  let serialized = {};
  for (const k of Object.keys(brewingModel))
    if (brewing[k]) serialized[k] = brewing[k];
  return Object.keys(serialized).length === 0 ? null : serialized;
}

/**
 * Serializes origin object data to fit an API request.
 *
 * @param origin {Object} Origin object

function originSerializer(origin) {
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

/**
 * Serializes vision parser response to fit in tea object.
 *
 * @param {VisionData} data - Vision parser response
 * @param {CategoryModel[]} categories - Central categories state
 * @param {SubcategoryModel[]} subcategories - Central subcategories state
 * @param {VendorModel[]} vendors - Central vendors state

export function visionParserSerializer(
  data: VisionData,
  categories: CategoryModel[],
  subcategories: SubcategoryModel[],
  vendors: VendorModel[]
) {
  let serialized: VisionData = {};

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
*/