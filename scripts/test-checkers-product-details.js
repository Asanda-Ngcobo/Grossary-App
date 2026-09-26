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
    "oros-tropical-flavoured-apple-squash-2l-10705485EA";


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