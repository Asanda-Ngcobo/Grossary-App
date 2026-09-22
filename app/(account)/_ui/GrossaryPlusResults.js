function formatMoney(value) {
  return Number(value || 0).toFixed(2);
}


function GrossaryPlusResults({
  results, savingPlan,  onSelectPlan
}) {

  /*
   * Your API may pass either:
   *
   * data.result
   *
   * OR the whole:
   *
   * {
   *   success: true,
   *   result: {...}
   * }
   *
   * This supports both.
   */
  const data =
    results?.result ||
    results;


  const optimization =
    data?.optimization;


  const optimized =
    optimization?.optimized;


  const allocationsObject =
    optimized?.allocations ||
    {};


  /*
   * API returns:
   *
   * {
   *   checkers: {...},
   *   pnp: {...}
   * }
   *
   * Convert it to an array for rendering.
   */
  const allocations =
    Object.values(
      allocationsObject
    ).filter(
      store =>
        store &&
        store.itemCount > 0
    );


  const total =
    optimized?.total ||
    0;


  const combinationSavings =
    optimization?.combinationSavings ||
    0;


  const promotionalSavings =
    optimized?.promotionalSavings ||
    0;

const totalSavings = combinationSavings + promotionalSavings || 0;
  const storesUsed =
    optimized?.storesUsed ||
    allocations.length;


  const cheapestSingleStore =
    optimization
      ?.singleStoreOptions
      ?.cheapest;


  const shoppingLocation =
    data?.shoppingLocation;


  const complete =
    optimization?.complete;


  const unmatchedItems =
    optimization?.unmatchedItems ||
    [];


  if (
    !optimization ||
    !optimized
  ) {

    return (
      <div
        className="
          bg-white
          border
          border-gray-100
          rounded-3xl
          p-6
          text-center
        "
      >

        <p
          className="
            font-bold
            text-[#0B2E1E]
          "
        >
          We couldn`t create your shopping plan.
        </p>

        <p
          className="
            text-sm
            text-gray-500
            mt-2
          "
        >
          Please try again.
        </p>

      </div>
    );
  }


  return (
    <div
      className="
        space-y-5
      "
    >

      {/* ================================= */}
      {/* SUCCESS HEADER */}
      {/* ================================= */}

      <section>

        <div
          className="
            w-12
            h-12
            rounded-2xl
            bg-[#E9FFF4]
            text-[#1EC677]
            flex
            items-center
            justify-center
            font-bold
            text-xl
            mb-4
          "
        >
          ✓
        </div>


        <p
          className="
            text-xs
            uppercase
            tracking-wider
            font-bold
            text-[#1EC677]
          "
        >
          Optimisation complete
        </p>


        <h1
          className="
            text-2xl
            sm:text-3xl
            font-bold
            text-[#0B2E1E]
            mt-1
          "
        >
          Here`s your best shopping plan
        </h1>


        {shoppingLocation && (

          <p
            className="
              text-sm
              text-gray-500
              mt-2
            "
          >
            Based on stores around{" "}

            <span
              className="
                font-medium
                text-[#0B2E1E]
              "
            >
              {shoppingLocation.name}
            </span>

            .
          </p>

        )}

      </section>


      {/* ================================= */}
      {/* HERO CARD */}
      {/* ================================= */}

      <section
        className="
          bg-[#0B2E1E]
          text-white
          rounded-3xl
          p-6
        "
      >

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >

          <div>

            <p
              className="
                text-xs
                font-bold
                text-[#1EC677]
              "
            >
              BEST OPTION
            </p>


            <p
              className="
                text-sm
                text-white/60
                mt-3
              "
            >
              Estimated basket total
            </p>


            <p
              className="
                text-4xl
                font-bold
                mt-1
              "
            >
              R
              {formatMoney(
                total
              )}
            </p>

          </div>


          <div
            className="
              bg-white/10
              rounded-2xl
              px-4
              py-3
              text-center
            "
          >

            <p
              className="
                text-xs
                text-white/60
              "
            >
              Stores
            </p>


            <p
              className="
                text-xl
                font-bold
              "
            >
              {storesUsed}
            </p>

          </div>

        </div>


        {combinationSavings >
          0 && (

          <div
            className="
              mt-6
              pt-5
              border-t
              border-white/10
            "
          >

            <p
              className="
                text-sm
                text-white/60
              "
            >
              Save by following this plan
            </p>


            <p
              className="
                text-2xl
                font-bold
                text-[#1EC677]
                mt-1
              "
            >
              R
              {formatMoney(
                totalSavings
              )}
            </p>


            <p
              className="
                text-xs
                text-white/50
                mt-1
              "
            >
              compared with the cheapest complete single-store basket
            </p>

          </div>

        )}

      </section>


      {/* ================================= */}
      {/* SAVINGS */}
      {/* ================================= */}

      <div
        className="
          grid
          grid-cols-2
          gap-3
        "
      >

        <div
          className="
            bg-white
            border
            border-gray-100
            rounded-2xl
            p-4
          "
        >

          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Smart split savings
          </p>


          <p
            className="
              text-xl
              font-bold
              text-[#0B2E1E]
              mt-1
            "
          >
            R
            {formatMoney(
              combinationSavings
            )}
          </p>


          <p
            className="
              text-xs
              text-gray-400
              mt-1
            "
          >
            By choosing the cheaper store per item
          </p>

        </div>


        <div
          className="
            bg-white
            border
            border-gray-100
            rounded-2xl
            p-4
          "
        >

          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Retailer promotions
          </p>


          <p
            className="
              text-xl
              font-bold
              text-[#1EC677]
              mt-1
            "
          >
            R
            {formatMoney(
              promotionalSavings
            )}
          </p>


          <p
            className="
              text-xs
              text-gray-400
              mt-1
            "
          >
            Advertised promotional savings
          </p>

        </div>

      </div>


      {/* ================================= */}
      {/* SHOPPING LOCATION */}
      {/* ================================= */}

      {shoppingLocation && (

        <section
          className="
            bg-white
            border
            border-gray-100
            rounded-2xl
            p-5
          "
        >

          <div
            className="
              flex
              items-start
              gap-3
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-[#E9FFF4]
                flex
                items-center
                justify-center
              "
            >
              📍
            </div>


            <div>

              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Shopping location
              </p>


              <p
                className="
                  font-bold
                  text-[#0B2E1E]
                  mt-1
                "
              >
                {shoppingLocation.name}
              </p>


              {shoppingLocation.distanceKm !=
                null && (

                <p
                  className="
                    text-xs
                    text-gray-500
                    mt-1
                  "
                >
                  About{" "}

                  {Number(
                    shoppingLocation
                      .distanceKm
                  ).toFixed(
                    1
                  )}

                  {" "}km away
                </p>

              )}

            </div>

          </div>

        </section>

      )}


      {/* ================================= */}
      {/* SHOPPING PLAN */}
      {/* ================================= */}

      <section>

        <div
          className="
            mb-4
          "
        >

          <h2
            className="
              text-lg
              font-bold
              text-[#0B2E1E]
            "
          >
            Your shopping plan
          </h2>


          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            Buy each item at the store where Grossary found the best price.
          </p>

        </div>


        {allocations.length >
          0 ? (

          <div
            className="
              space-y-4
            "
          >

            {allocations.map(
              (
                store,
                storeIndex
              ) => {

                /*
                 * Get actual branch name
                 * from shoppingLocation.
                 */
                const isCheckers =
                  store.retailer ===
                  "Checkers";


                const storeDetails =
                  isCheckers
                    ? shoppingLocation
                        ?.checkers
                    : shoppingLocation
                        ?.pnp;


                return (
                  <div
                    key={
                      `${store.retailer}-${storeIndex}`
                    }
                    className="
                      bg-white
                      border
                      border-gray-100
                      rounded-3xl
                      overflow-hidden
                    "
                  >

                    {/* STORE HEADER */}

                    <div
                      className="
                        px-5
                        py-4
                        flex
                        items-center
                        justify-between
                        border-b
                        border-gray-100
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            w-10
                            h-10
                            rounded-xl
                            bg-gray-100
                            flex
                            items-center
                            justify-center
                          "
                        >
                          🛒
                        </div>


                        <div>

                          <p
                            className="
                              text-base
                              font-bold
                              text-[#0B2E1E]
                            "
                          >
                            {
                              store.retailer
                            }
                          </p>


                          {storeDetails
                            ?.storeName && (

                            <p
                              className="
                                text-xs
                                text-gray-500
                                mt-0.5
                              "
                            >
                              {
                                storeDetails
                                  .storeName
                              }
                            </p>

                          )}

                        </div>

                      </div>


                      <div
                        className="
                          text-right
                        "
                      >

                        <p
                          className="
                            text-xs
                            text-gray-400
                          "
                        >
                          {
                            store.itemCount
                          }{" "}
                          {
                            store.itemCount ===
                            1
                              ? "item"
                              : "items"
                          }
                        </p>


                        <p
                          className="
                            font-bold
                            text-[#0B2E1E]
                            mt-0.5
                          "
                        >
                          R
                          {formatMoney(
                            store.total
                          )}
                        </p>

                      </div>

                    </div>


                    {/* ITEMS */}

                    <div
                      className="
                        divide-y
                        divide-gray-100
                      "
                    >

                      {store.items?.map(
                        (
                          item,
                          itemIndex
                        ) => {

                          const product =
                            item.product ||
                            {};


                          const requestedItem =
                            item.requestedItem ||
                            {};


                          return (
                            <div
                              key={
                                requestedItem.id ||
                                itemIndex
                              }
                              className="
                                px-5
                                py-4
                                flex
                                items-start
                                justify-between
                                gap-4
                              "
                            >

                              <div
                                className="
                                  flex-1
                                  min-w-0
                                "
                              >

                                {/* Actual matched product */}

                                <p
                                  className="
                                    text-sm
                                    font-semibold
                                    text-[#0B2E1E]
                                  "
                                >
                                  {
                                    product.productName ||
                                    requestedItem.item_name ||
                                    "Product"
                                  }
                                </p>


                                {/* Original request */}

                                {product.productName &&
                                  requestedItem.item_name &&
                                  product.productName !==
                                    requestedItem.item_name && (

                                    <p
                                      className="
                                        text-xs
                                        text-gray-400
                                        mt-1
                                      "
                                    >
                                      For:{" "}

                                      {
                                        requestedItem
                                          .item_name
                                      }
                                    </p>

                                  )}


                                <p
                                  className="
                                    text-xs
                                    text-gray-500
                                    mt-1
                                  "
                                >
                                  {
                                    item.quantity ||
                                    1
                                  }

                                  {" × R"}

                                  {formatMoney(
                                    item.unitPrice
                                  )}
                                </p>


                                {/* PROMOTION */}

                                {Number(
                                  item.promotionalSavings ||
                                  0
                                ) >
                                  0 && (

                                  <span
                                    className="
                                      inline-flex
                                      mt-2
                                      bg-[#E9FFF4]
                                      text-[#168B55]
                                      text-xs
                                      font-semibold
                                      rounded-full
                                      px-2.5
                                      py-1
                                    "
                                  >
                                    Save R
                                    {formatMoney(
                                      item.promotionalSavings
                                    )}
                                  </span>

                                )}

                              </div>


                              <div
                                className="
                                  text-right
                                  flex-shrink-0
                                "
                              >

                                <p
                                  className="
                                    font-bold
                                    text-[#0B2E1E]
                                  "
                                >
                                  R
                                  {formatMoney(
                                    item.lineTotal
                                  )}
                                </p>


                                {item.priceSource && (

                                  <p
                                    className="
                                      text-[10px]
                                      uppercase
                                      tracking-wide
                                      text-gray-400
                                      mt-1
                                    "
                                  >
                                    {
                                      item.priceSource
                                    } price
                                  </p>

                                )}

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>


                    {/* STORE SAVINGS */}

                    {Number(
                      store.promotionalSavings ||
                      0
                    ) >
                      0 && (

                      <div
                        className="
                          bg-[#F4FFF9]
                          px-5
                          py-3
                          flex
                          items-center
                          justify-between
                        "
                      >

                        <span
                          className="
                            text-xs
                            text-gray-600
                          "
                        >
                          Promotional savings
                        </span>


                        <span
                          className="
                            text-sm
                            font-bold
                            text-[#1EC677]
                          "
                        >
                          R
                          {formatMoney(
                            store.promotionalSavings
                          )}
                        </span>

                      </div>

                    )}

                  </div>
                );
              }
            )}

          </div>

        ) : (

          <div
            className="
              bg-white
              rounded-2xl
              border
              border-gray-100
              p-6
              text-center
            "
          >

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              No store allocations were returned.
            </p>

          </div>

        )}

      </section>
<button
  onClick={() =>
    onSelectPlan("best")
  }
  disabled={savingPlan}
  className="
    mt-5
    w-full
    bg-[#1EC677]
    text-[#0B2E1E]
    font-bold
    py-3.5
    px-5
    rounded-2xl
    hover:opacity-90
    transition
    disabled:opacity-50
  "
>
  {savingPlan
    ? "Updating your list..."
    : "Use Best Option"}
</button>

      {/* ================================= */}
      {/* SINGLE STORE OPTION */}
      {/* ================================= */}

      {cheapestSingleStore && (

        <section
          className="
            bg-[#F2F4F3]
            rounded-2xl
            p-5
          "
        >

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-gray-500
            "
          >
            Convenience option
          </p>


          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              mt-2
            "
          >

            <div>

              <p
                className="
                  font-bold
                  text-[#0B2E1E]
                "
              >
                Shop at only{" "}

                {
                  cheapestSingleStore
                    .retailer
                }
              </p>


              <p
                className="
                  text-xs
                  text-gray-500
                  mt-1
                "
              >
                Complete the entire basket at one store.
              </p>

            </div>


            <p
              className="
                font-bold
                text-[#0B2E1E]
                whitespace-nowrap
              "
            >
              R
              {formatMoney(
                cheapestSingleStore.total
              )}
            </p>

          </div>


          {combinationSavings >
            0 && (

            <p
              className="
                text-xs
                text-gray-500
                mt-3
              "
            >
              Grossary`s recommended split saves you{" "}

              <span
                className="
                  font-bold
                  text-[#1EC677]
                "
              >
                R
                {formatMoney(
                  combinationSavings
                )}
              </span>

              .
            </p>

          )}

        </section>

      )}

<button
  onClick={() =>
    onSelectPlan("convenience")
  }
  disabled={savingPlan}
  className="
    mt-4
    w-full
    bg-white
    border
    border-[#0B2E1E]
    text-[#0B2E1E]
    font-bold
    py-3.5
    px-5
    rounded-2xl
    hover:bg-gray-50
    transition
    disabled:opacity-50
  "
>
  Use Convenience Option
</button>
      {/* ================================= */}
      {/* UNMATCHED ITEMS */}
      {/* ================================= */}

      {!complete &&
        unmatchedItems.length >
          0 && (

        <section
          className="
            border
            border-orange-100
            bg-orange-50
            rounded-2xl
            p-5
          "
        >

          <p
            className="
              font-bold
              text-[#0B2E1E]
            "
          >
            Some items couldn`t be compared
          </p>


          <p
            className="
              text-sm
              text-gray-600
              mt-1
            "
          >
            We couldn`t confidently find prices for{" "}

            {
              unmatchedItems.length
            }

            {" "}
            {
              unmatchedItems.length ===
              1
                ? "item"
                : "items"
            }

            .
          </p>

        </section>

      )}

    </div>
  );
}


export default GrossaryPlusResults;