require("dotenv").config({
  path: ".env.local",
});

const {
  getCheckersProductDetails,
} = require(
  "../app/_lib/grocery/providers/checkers"
);


async function test() {

  const slug =
    "tomatoes-1kg-61a5c62834e80bb5a52f0fe6";


  console.log(
    "\n================================"
  );

  console.log(
    "CHECKERS PRODUCT DETAILS TEST"
  );

  console.log(
    "================================"
  );

  console.log(
    "Slug:",
    slug
  );


  const result =
    await getCheckersProductDetails(
      slug
    );


  console.log(
    "\nFULL RESPONSE"
  );

  console.log(
    "================================"
  );


  console.dir(
    result,
    {
      depth: null,
    }
  );

}


test().catch(
  (error) => {

    console.error(
      "\nTEST FAILED:"
    );

    console.error(
      error
    );

    process.exit(1);

  }
);