require("dotenv").config({
  path: ".env.local",
});


const {
  reverseGeocode,
} = require(
  "../app/_lib/grocery/location/reverseGeocode"
);


const USER_LATITUDE =
  -29.85;

const USER_LONGITUDE =
  31.00;


async function main() {

  console.log(
    "\nReverse geocoding..."
  );


  console.log(
    "Latitude:",
    USER_LATITUDE
  );

  console.log(
    "Longitude:",
    USER_LONGITUDE
  );


  const location =
    await reverseGeocode(
      USER_LATITUDE,
      USER_LONGITUDE
    );


  console.log(
    "\n=============================="
  );

  console.log(
    "USER LOCATION"
  );

  console.log(
    "==============================\n"
  );


  console.log(
    location
  );


  console.log(
    "\nPnP search query:"
  );

  console.log(
    location.city
  );
}


main().catch(
  error => {

    console.error(
      "\nReverse geocode test failed:"
    );

    console.error(
      error
    );

  }
);