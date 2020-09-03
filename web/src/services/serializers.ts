import {
  CategoryModel,
  SubcategoryModel,
  TeaModel,
  VendorModel,
  VisionData,
} from "./models";

/**
 * Extracts data from a vision parser response and returns a tea object.
 *
 * @category Services
 * @param {VisionData} data - Vision parser response
 * @param {CategoryModel[]} categories - Categories state
 * @param {SubcategoryModel[]} subcategories - Subcategories state
 * @param {VendorModel[]} vendors - Vendors state
 * @return {TeaModel|undefined}
 */
export function visionParserSerializer(
  data: VisionData,
  categories: CategoryModel[],
  subcategories: SubcategoryModel[],
  vendors: VendorModel[]
): TeaModel | undefined {
  console.log("vd", data)
  let serialized: TeaModel = {};

  if (data.name) serialized.name = data.name;

  if (data.year) serialized.year = data.year;

  if (data.category) {
    const category = Object.values(categories).find(
      (value) => value.id === data.category
    );
    if (category) {
      serialized.category = category.id;

      if (category.western_brewing)
        serialized.western_brewing = category.western_brewing;
      if (category.gongfu_brewing)
        serialized.gongfu_brewing = category.gongfu_brewing;
    }
  }

  if (data.subcategory) {
    const subcategory = Object.values(subcategories).find(
      (value) => value.id === data.subcategory
    );

    if (subcategory) {
      serialized.subcategory = subcategory;

      if (subcategory.origin) serialized.origin = subcategory.origin;
      if (subcategory.western_brewing)
        serialized.western_brewing = subcategory.western_brewing;
      if (subcategory.gongfu_brewing)
        serialized.gongfu_brewing = subcategory.gongfu_brewing;
    }
  }

  if (data.vendor) {
    const vendor = Object.values(vendors).find(
      (value) => value.id === data.vendor
    );
    if (vendor) serialized.vendor = vendor;
  }

  console.log(data);
  console.log(serialized);

  return Object.keys(serialized).length ? serialized : undefined;
}
