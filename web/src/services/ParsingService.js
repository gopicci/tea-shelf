export function getSubcategoryName(subcategory) {
  if (!subcategory) return
  if (subcategory.translated_name)
    return subcategory.name + ' ('+ subcategory.translated_name + ')'
  else
    return subcategory.name
}