import { OriginModel } from "./models";
import { APIRequest } from "./auth-services";
import { parse as himalaya } from "himalaya";

type AutocompletePrediction = google.maps.places.AutocompletePrediction;

/**
 * Gets selected place details from API, parses them and returns an OriginModel.
 *
 * @category Services
 * @param {AutocompletePrediction} place - Google place autocomplete prediction item
 * @param {string} token - UUIDv4 maps session token
 * @returns {Promise<OriginModel|void>}
 */
export async function getOriginFromPlace(
  place: AutocompletePrediction,
  token: string
): Promise<OriginModel | void> {
  const res = await APIRequest(
    "/places/details/",
    "POST",
    JSON.stringify({ place_id: place.place_id, token: token })
  );
  if (res.ok) {
    const body = await res.json();
    const adr: object = himalaya(body.result.adr_address);
    const origin: OriginModel = { country: "" };

    let extendedAddress = "";
    for (const value of Object.values(adr))
      if (value.type === "element") {
        if (value.attributes[0].value === "country-name")
          origin["country"] = value.children[0].content;
        if (value.attributes[0].value === "region")
          origin["region"] = value.children[0].content;
        if (value.attributes[0].value === "locality")
          origin["locality"] = value.children[0].content;
        if (value.attributes[0].value === "extended-address")
          extendedAddress = value.children[0].content;
      }

    if (extendedAddress) origin["locality"] = extendedAddress.split(",")[0];

    if (origin["region"])
      origin["region"] = origin["region"].replace(" Province", "");

    origin["latitude"] = body.result.geometry.location.lat;
    origin["longitude"] = body.result.geometry.location.lng;

    return origin;
  }
}
