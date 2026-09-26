require("dotenv").config({
  path: ".env.local",
});


const {
  getCheckersBonusBuy,
} = require(
  "../app/_lib/grocery/providers/checkers"
);


async function test() {

  const storeId =
    "162387";

  const bonusBuyId =
    "6aa3f6487f9ef8e1acca61d9";


  console.log(
    "\n================================"
  );

  console.log(
    "CHECKERS BONUS BUY TEST"
  );

  console.log(
    "================================"
  );

  console.log(
    "Store:",
    storeId
  );

  console.log(
    "Bonus Buy:",
    bonusBuyId
  );


  const result =
    await getCheckersBonusBuy(
      bonusBuyId,
      storeId
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