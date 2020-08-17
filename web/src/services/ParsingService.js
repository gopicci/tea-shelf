import { countryCodes } from "./CountryCodes";

/**
 * Attempt to build subcategory name in "name (translated_name)" format
 * or return subcategory name.
 */
export function getSubcategoryName(subcategory) {
  if (!subcategory) return;
  if (subcategory.translated_name)
    return subcategory.name + " (" + subcategory.translated_name + ")";
  else return subcategory.name;
}

/**
 * Build origin name towards an ideal "locality, region, country"
 * format depending on available data.
 */
export function getOriginName(origin) {
  if (!origin) return;
  if (!origin.country) return;
  let name = "";
  if (origin.locality) name += origin.locality + ", ";
  if (origin.region) name += origin.region + ", ";
  name += origin.country;
  return name;
}

/**
 * Returns origin region if present, or locality, or country.
 */
export function getOriginShortName(origin) {
  if (!origin) return;
  if (!origin.country) return;
  if (origin.region) return origin.region;
  if (origin.locality) return origin.locality;
  return origin.country;
}

/**
 * Convert celsius to fahrenheit.
 */
export function celsiusToFahrenheit(c) {
  return String(Math.round((parseInt(c) * 9) / 5 + 32));
}

/**
 * Convert fahrenheit to celsius.
 */
export function fahrenheitToCelsius(f) {
  return String(Math.round(((parseInt(f) - 32) * 5) / 9));
}

/**
 * Return string of float input trimmed to crop decimals.
 *
 * toFixed trims decimals but also converts to string
 * toString removes trailing zeroes
 */
export function cropToNoZeroes(input, crop) {
  return parseFloat(input.toFixed(crop)).toString();
}

/**
 * Get seconds out of hh:mm:ss format.
 */
export function parseHMSToSeconds(time) {
  const s = String(time);
  if (s.includes(":")) {
    // Input is API format dd hh:mm:ss
    let days = 0;
    if (s.includes(" ")) days = parseInt(s.slice(0, 2));
    const a = s.slice(-8).split(":");
    return parseInt(days * 24 * 3600 + +a[0] * 3600 + +a[1] * 60 + +a[2]);
  } else return parseInt(time);
}

/**
 * Convert brewing time from API hh:mm:ss format into seconds.
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
 * Return country code from the country name/code.
 */
export function getCountryCode(countryName) {
  if (!countryName) return "";
  if (countryCodes[countryName]) return countryCodes[countryName];
  if (Object.values(countryCodes).includes(countryName)) return countryName;
  return "";
}
