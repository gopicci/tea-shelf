export function getSubcategoryName(subcategory) {
  if (!subcategory) return;
  if (subcategory.translated_name)
    return subcategory.name + " (" + subcategory.translated_name + ")";
  else return subcategory.name;
}

export function getOriginName(origin) {
  if (!origin) return;
  if (!origin.country) return;
  let name = "";
  if (origin.locality) name += origin.locality + ", ";
  if (origin.region) name += origin.region + ", ";
  name += origin.country;
  return name;
}

export function celsiusToFahrenheit(c) {
  return String(Math.round(parseInt(c) * 9/5 + 32))
}

export function cropToNoZeroes(input, crop) {
  // toFixed trims decimals but also converts to string. To string removes trailing zeroes
  return parseFloat(input.toFixed(crop)).toString()
}