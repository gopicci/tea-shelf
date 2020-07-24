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
  return String(Math.round((parseInt(c) * 9) / 5 + 32));
}

export function cropToNoZeroes(input, crop) {
  // toFixed trims decimals but also converts to string. To string removes trailing zeroes
  return parseFloat(input.toFixed(crop)).toString();
}

export function brewingTimesToSeconds(brewing) {
  let newBrewing = {...brewing}
  if (brewing.initial) {
    const a = String(brewing.initial).split(":");
    newBrewing.initial = (+a[0] * 3600 + +a[1] * 60 + +a[2]).toString();
  }
  if (brewing.increments) {
    const b = String(brewing.increments).split(":");
    newBrewing.increments = (+b[0] * 3600 + +b[1] * 60 + +b[2]).toString();
  }
  return newBrewing;
}
