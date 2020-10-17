import { countryCodes } from "./country-codes";
import {
  CategoryModel,
  SubcategoryModel,
  OriginModel,
  TeaInstance,
  SessionInstance,
  Clock,
  SessionModel,
  BrewingModel,
  TeaModel,
} from "./models";

/**
 * Gets category name from list of categories based on id.
 *
 * @category Services
 * @param {CategoryModel[]} categories - List of categories
 * @param {number} id - Category ID
 * @returns {string}
 */
export function getCategoryName(
  categories: CategoryModel[],
  id: number
): string {
  const category = Object.values(categories).find((value) => value.id === id);
  if (category?.name)
    return category.name.charAt(0) + category.name.slice(1).toLowerCase();
  else return "";
}

/**
 * Attempts to build subcategory name in preferred "name (translated_name)"
 * format or returns "name" otherwise.
 *
 * @category Services
 * @param {SubcategoryModel} subcategory - Subcategory object
 * @returns {string}
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
 * @category Services
 * @param {OriginModel} origin - Origin object
 * @returns {string}
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
 * @category Services
 * @param {OriginModel} origin - Origin object
 * @returns {string}
 */
export function getOriginShortName(origin: OriginModel): string {
  if (origin.region) return origin.region;
  if (origin.locality) return origin.locality;
  return origin.country;
}

/**
 * Converts celsius to fahrenheit.
 *
 * @category Services
 * @param {number} c - Celsius degrees
 * @returns {number}
 */
export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

/**
 * Converts fahrenheit to celsius.
 *
 * @category Services
 * @param {number} f - Fahrenheit degrees
 * @returns {number}
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
 * @category Services
 * @param {number} input - Input float
 * @param {number} [crop] - Decimals to keep
 * @returns {string}
 */
export function cropToNoZeroes(input: number, crop?: number): string {
  return parseFloat(input.toFixed(crop ? crop : 0)).toString();
}

/**
 * Returns seconds from a string in API time format "hh:mm:ss".
 *
 * @category Services
 * @param {string} time - Time in dd hh:mm:ss format
 * @returns {number}
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
 * @category Services
 * @param {number} seconds - Time in seconds
 * @returns {string}
 */
export function parseSecondsToHMS(seconds: number): string {
  return new Date(seconds * 1000).toISOString().substr(11, 8);
}

/**
 * Returns country code from the country name/code.
 *
 * @category Services
 * @param {string} country - Country name or code
 * @returns {string}
 */
export function getCountryCode(country: string): string {
  if (countryCodes[country]) return countryCodes[country];
  if (Object.values(countryCodes).includes(country)) return country;
  return "";
}

/**
 * Returns a tea instance from an ID.
 *
 * @category Services
 * @param {TeaInstance[]} teas - List of teas
 * @param {string} id - Lookup tea ID
 * @returns {TeaInstance|undefined}
 */
export function getTeaDetails(teas: TeaInstance[], id: string) {
  return Object.values(teas).find((value) => value.id === id);
}

/**
 * Derives countdown finish time from session and starting date.
 *
 * @category Services
 * @param {SessionInstance} session - Brewing session instance
 * @param {number} start - Starting date in milliseconds
 * @returns {number}
 */
export function getEndDate(start: number, session: SessionInstance) {
  const brewing = session.brewing;
  const initial = brewing.initial ? parseHMSToSeconds(brewing.initial) : 0;
  const increments = brewing.increments
    ? parseHMSToSeconds(brewing.increments)
    : 0;
  return start + (initial + increments * (session.current_infusion - 1)) * 1000;
}

/**
 * Returns true if a clock has expired.
 *
 * @category Services
 * @param {Clock} clock - Clock object
 * @param {SessionInstance} session - Related session instance
 * @returns {boolean}
 */
export function isClockExpired(clock: Clock, session: SessionInstance) {
  if (clock && session) {
    const date = getEndDate(clock.starting_time, session);
    if (date < Date.now()) return true;
  }
  return false;
}

/**
 * Builds a SessionModel object out of a tea instance.
 *
 * @category Services
 * @param {TeaModel} teaData - Tea object
 * @param {"gongfu_brewing"|"western_brewing"} brewingType - Brewing type
 * @returns {SessionModel}
 */
export function sessionFromTea(
  teaData: TeaModel,
  brewingType: "gongfu_brewing" | "western_brewing"
): SessionModel {
  let session = {} as SessionModel;

  let brewing: BrewingModel = {};

  if (teaData[brewingType]?.temperature)
    brewing["temperature"] = teaData[brewingType]?.temperature;

  if (teaData[brewingType]?.weight)
    brewing["weight"] = teaData[brewingType]?.weight;

  brewing["initial"] = teaData[brewingType]?.initial
    ? teaData[brewingType]?.initial
    : "00:00:00";
  brewing["increments"] = teaData[brewingType]?.increments
    ? teaData[brewingType]?.increments
    : "00:00:00";

  session["brewing"] = brewing;

  session["name"] = teaData.name;
  session["current_infusion"] = 1;
  session["is_completed"] = false;

  return session;
}
