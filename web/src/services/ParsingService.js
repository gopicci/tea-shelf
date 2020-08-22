import { countryCodes } from "./CountryCodes";

/**
 * Attempts to build subcategory name in "name (translated_name)" format
 * or returns subcategory name.
 *
 * @param subcategory {Object} Subcategory object
 * @returns {string|undefined}
 */
export function getSubcategoryName(subcategory) {
  if (!subcategory) return;
  if (subcategory.translated_name)
    return subcategory.name + " (" + subcategory.translated_name + ")";
  else return subcategory.name;
}

/**
 * Attempts to build origin name towards an ideal "locality, region, country"
 * format depending on available data.
 *
 * @param origin {Object} Origin object
 * @returns {string|undefined}
 */
export function getOriginName(origin) {
  if (!origin || !origin.country) return;
  let name = "";
  if (origin.locality) name += origin.locality + ", ";
  if (origin.region) name += origin.region + ", ";
  name += origin.country;
  return name;
}

/**
 * Returns origin region if present, or locality, or country.
 *
 * @param origin {Object} Origin object
 * @returns {string|undefined}
 */
export function getOriginShortName(origin) {
  if (!origin || !origin.country) return;
  if (origin.region) return origin.region;
  if (origin.locality) return origin.locality;
  return origin.country;
}

/**
 * Converts celsius to fahrenheit.
 *
 * @param c {string} Celsius degrees
 * @returns {string}
 */
export function celsiusToFahrenheit(c) {
  return String(Math.round((parseInt(c) * 9) / 5 + 32));
}

/**
 * Converts fahrenheit to celsius.
 *
 * @param f {string} Fahrenheit degrees
 * @returns {string}
 */
export function fahrenheitToCelsius(f) {
  return String(Math.round(((parseInt(f) - 32) * 5) / 9));
}

/**
 * Converts float input to string with cropped decimals
 * and no trailing zeroes.
 *
 * toFixed trims decimals but also converts to string
 * toString removes trailing zeroes
 *
 * @param input {number} Input float
 * @param crop {number} Decimals to keep
 * @returns {string}
 */
export function cropToNoZeroes(input, crop) {
  return parseFloat(input.toFixed(crop)).toString();
}

/**
 * Gets seconds out of API time format.
 *
 * @param time {string} Time in dd hh:mm:ss format
 * @returns {number}
 */
export function parseHMSToSeconds(time) {
  const s = String(time);
  if (s.includes(":")) {
    // Input is API format dd hh:mm:ss
    let days = 0;
    if (s.includes(" ")) days = parseInt(s.slice(0, 2));
    const { hours, minutes, seconds } = s.slice(-8).split(":");
    return (
      days * 24 * 3600 +
      parseInt(hours) * 3600 +
      parseInt(minutes) * 60 +
      parseInt(seconds)
    );
  } else return parseInt(time);
}

/**
 * Converts brewing time from API dd hh:mm:ss format into seconds.
 *
 * @param brewing {Object}
 * @returns {Object}
 */
export function brewingTimesToSeconds(brewing) {
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
 * @param country {string} Country name or code
 * @returns {string}
 */
export function getCountryCode(country) {
  if (!country) return "";
  if (countryCodes[country]) return countryCodes[country];
  if (Object.values(countryCodes).includes(country)) return country;
  return "";
}
