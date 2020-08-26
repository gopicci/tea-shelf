import { countryCodes } from "./country-codes";
import {
  CategoryModel,
  SubcategoryModel,
  OriginModel,
  BrewingModel,
} from "./models";

/**
 * Gets category name from list of categories based on id.
 *
 * @param {CategoryModel[]} categories - List of categories
 * @param {number} id - Category ID
 * @returns {string}
 * @category Services
 */
export function getCategoryName(
  categories: CategoryModel[],
  id: number
): string {
  const category = Object.entries(categories).find(
    (entry) => entry[1].id === id
  );
  if (category && category[1].name) return category[1].name;
  else return "";
}

/**
 * Attempts to build subcategory name in preferred "name (translated_name)"
 * format or returns "name" otherwise.
 *
 * @param {SubcategoryModel} subcategory - Subcategory object
 * @returns {string}
 * @category Services
 */
export function getSubcategoryName(subcategory: SubcategoryModel): string {
  if (subcategory.translated_name)
    return subcategory.name + " (" + subcategory.translated_name + ")";
  else return subcategory.name;
}

/**
 * Attempts to build origin name towards an ideal "locality, region, country"
 * format depending on available data.
 *
 * @param {OriginModel} origin - Origin object
 * @returns {string}
 * @category Services
 */
export function getOriginName(origin: OriginModel): string {
  let name = "";
  if (origin?.locality) name += origin.locality + ", ";
  if (origin?.region) name += origin.region + ", ";
  if (origin?.country) name += origin.country;
  return name;
}

/**
 * Returns origin region if present, or locality, or country.
 *
 * @param {OriginModel} origin - Origin object
 * @returns {string}
 * @category Services
 */
export function getOriginShortName(origin: OriginModel): string {
  if (origin.region) return origin.region;
  if (origin.locality) return origin.locality;
  return origin.country;
}

/**
 * Converts celsius to fahrenheit.
 *
 * @param {number} c - Celsius degrees
 * @returns {number}
 * @category Services
 */
export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

/**
 * Converts fahrenheit to celsius.
 *
 * @param {number} f - Fahrenheit degrees
 * @returns {number}
 * @category Services
 */
export function fahrenheitToCelsius(f: number): number {
  return Math.round(((f - 32) * 5) / 9);
}

/**
 * Converts float input to string with cropped decimals
 * and no trailing zeroes.
 *
 * toFixed trims decimals but also converts to string
 * toString removes trailing zeroes
 *
 * @param {number} input - Input float
 * @param {number} crop - Decimals to keep
 * @returns {string}
 * @category Services
 */
export function cropToNoZeroes(input: number, crop: number): string {
  return parseFloat(input.toFixed(crop)).toString();
}

/**
 * Returns seconds from a string in API time format "hh:mm:ss".
 *
 * @param {string} time - Time in dd hh:mm:ss format
 * @returns {number}
 * @category Services
 */
export function parseHMSToSeconds(time: string): number {
  if (time.includes(":")) {
    let days = 0;
    if (time.includes(" ")) days = parseInt(time.slice(0, 2));
    const [hours, minutes, seconds] = time.slice(-8).split(":");
    return (
      days * 24 * 3600 +
      parseInt(hours) * 3600 +
      parseInt(minutes) * 60 +
      parseInt(seconds)
    );
  } else return parseInt(time);
}

/**
 * Returns "hh:mm:ss" API time format from seconds.
 *
 * @param {number} seconds - Time in seconds
 * @returns {string}
 * @category Services
 */
export function parseSecondsToHMS(seconds: number): string{
  return new Date(seconds * 1000).toISOString().substr(11, 8);
}

/**
 * Converts brewing time from API dd hh:mm:ss format into seconds.
 *
 * @param {BrewingModel} brewing - Brewing object
 * @returns {BrewingModel}
 * @category Services
 */
export function brewingTimesToSeconds(brewing: BrewingModel): BrewingModel {
  let newBrewing = { ...brewing };
  if (brewing.initial) {
    newBrewing.initial = parseHMSToSeconds(brewing.initial).toString();
  }
  if (brewing.increments) {
    newBrewing.increments = parseHMSToSeconds(brewing.increments).toString();
  }
  return newBrewing;
}

/**
 * Returns country code from the country name/code.
 *
 * @param {string} country - Country name or code
 * @returns {string}
 * @category Services
 */
export function getCountryCode(country: string): string {
  if (countryCodes[country]) return countryCodes[country];
  if (Object.values(countryCodes).includes(country)) return country;
  return "";
}
