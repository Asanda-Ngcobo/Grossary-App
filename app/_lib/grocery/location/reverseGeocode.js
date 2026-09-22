const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/reverse";


async function reverseGeocode(
  latitude,
  longitude
) {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    throw new Error(
      "Invalid latitude or longitude."
    );
  }


  const url =
    new URL(
      NOMINATIM_URL
    );


  url.searchParams.set(
    "lat",
    String(latitude)
  );

  url.searchParams.set(
    "lon",
    String(longitude)
  );

  url.searchParams.set(
    "format",
    "jsonv2"
  );

  url.searchParams.set(
    "addressdetails",
    "1"
  );


  const response =
    await fetch(
      url.toString(),
      {
        headers: {
          Accept:
            "application/json",

          /*
           * Nominatim requires an
           * identifying User-Agent.
           */
          "User-Agent":
            "Grossary/1.0 (grossary.shop)",
        },

        cache:
          "no-store",
      }
    );


  if (!response.ok) {
    throw new Error(
      `Reverse geocoding failed: ${response.status}`
    );
  }


  const data =
    await response.json();


  const address =
    data?.address || {};


  /*
   * OSM uses different address
   * fields depending on the area.
   */
  const city =
    address.city ||
    address.town ||
    address.municipality ||
    address.village ||
    null;


  const suburb =
    address.suburb ||
    address.neighbourhood ||
    address.city_district ||
    null;


  const province =
    address.state ||
    null;


  if (!city) {
    throw new Error(
      "Could not determine city from coordinates."
    );
  }


  return {
    city,
    suburb,
    province,

    displayName:
      data?.display_name ||
      null,
  };
}


module.exports = {
  reverseGeocode,
};