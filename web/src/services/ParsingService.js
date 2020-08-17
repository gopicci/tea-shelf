import { countryCodes } from "./CountryCodes";

export function getSubcategoryName(subcategory) {
  /**
   * Attempt to build subcategory name in "name (translated_name)" format
   * or return subcategory name.
   */
  if (!subcategory) return;
  if (subcategory.translated_name)
    return subcategory.name + " (" + subcategory.translated_name + ")";
  else return subcategory.name;
}

export function getOriginName(origin) {
  /**
   * Build origin name towards an ideal "locality, region, country"
   * format depending on available data.
   */
  if (!origin) return;
  if (!origin.country) return;
  let name = "";
  if (origin.locality) name += origin.locality + ", ";
  if (origin.region) name += origin.region + ", ";
  name += origin.country;
  return name;
}

export function getOriginShortName(origin) {
  /**
   * Returns origin region if present, or locality, or country.
   */
  if (!origin) return;
  if (!origin.country) return;
  if (origin.region) return origin.region;
  if (origin.locality) return origin.locality;
  return origin.country;
}

export function celsiusToFahrenheit(c) {
  /**
   * Convert celsius to fahrenheit.
   */
  return String(Math.round((parseInt(c) * 9) / 5 + 32));
}

export function fahrenheitToCelsius(f) {
  /**
   * Convert fahrenheit to celsius.
   */
  return String(Math.round((parseInt(f) - 32) * 5 / 9));
}

export function cropToNoZeroes(input, crop) {
  /**
   * Return string of float input trimmed to crop decimals.
   */
  // toFixed trims decimals but also converts to string
  // toString removes trailing zeroes
  return parseFloat(input.toFixed(crop)).toString();
}

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

export function brewingTimesToSeconds(brewing) {
  /**
   * Convert brewing time from API hh:mm:ss format into seconds.
   */
  let newBrewing = { ...brewing };
  if (brewing.initial) {
    newBrewing.initial = (parseHMSToSeconds(brewing.initial)).toString();
  }
  if (brewing.increments) {
    newBrewing.increments = (parseHMSToSeconds(brewing.increments)).toString();
  }
  return newBrewing;
}

export function getCountryCode(countryName) {
  /**
   * Return country code from the country name/code.
   */
  if (!countryName) return "";
  if (countryCodes[countryName]) return countryCodes[countryName];
  if (Object.values(countryCodes).includes(countryName)) return countryName;
  return "";
}
