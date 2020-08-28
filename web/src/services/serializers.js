/**
 * Serialize vision parser response to fit in tea object
 *
 * @param data {json} Vision parser response
 * @param categories {json} Categories state
 * @param subcategories {json} Subcategories state
 * @param vendors {json} Vendors state
 */
export function visionParserSerializer(
  data,
  categories,
  subcategories,
  vendors
) {
  let serialized = {};

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
/*
    if (subcategory.western_brewing)
      serialized.western_brewing = brewingTimesToSeconds(
        subcategory.western_brewing
      );

    if (subcategory.gongfu_brewing)
      serialized.gongfu_brewing = brewingTimesToSeconds(
        subcategory.gongfu_brewing
      );
 */
  }

  if (data.vendor)
    serialized.vendor = Object.entries(vendors).find(
      (entry) => entry[1].name === data.vendor
    )[1];

  return Object.keys(serialized).length === 0 ? null : serialized;
}
