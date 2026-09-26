function formatMoney(value) {
  return Number(value || 0).toFixed(2);
}


/*
 * ------------------------------------------------
 * Convert allocations into an array
 * ------------------------------------------------
 */

function normalizeAllocations(
  allocations
) {

  if (
    Array.isArray(
      allocations
    )
  ) {

    return allocations.filter(
      store =>
        store &&
        Array.isArray(
          store.items
        ) &&
        store.items.length > 0
    );
  }


  if (
    allocations &&
    typeof allocations ===
      "object"
  ) {

    return Object.values(
      allocations
    ).filter(
      store =>
        store &&
        (
          Number(
            store.itemCount ||
            0
          ) > 0 ||
          (
            Array.isArray(
              store.items
            ) &&
            store.items.length >
              0
          )
        )
    );
  }


  return [];
}


/*
 * ------------------------------------------------
 * Retailer loyalty branding
 * ------------------------------------------------
 */

function getLoyaltyDetails(
  retailer
) {

  const normalizedRetailer =
    String(
      retailer || ""
    )
      .trim()
      .toLowerCase();


  if (
    normalizedRetailer ===
    "checkers"
  ) {

    return {
      name:
        "Xtra Savings",

      color:
        "#38A8AE",

      background:
        "#EAF7F8",
    };
  }


  if (
    normalizedRetailer ===
      "pnp" ||
    normalizedRetailer ===
      "pick n pay" ||
    normalizedRetailer ===
      "pick n pay"
  ) {

    return {
      name:
        "Smart Shopper",

      color:
        "#003359",

      background:
        "#E8EEF0",
    };
  }


  return {
    name:
      "Loyalty",

    color:
      "#168B55",

    background:
      "#E9FFF4",
  };
}


/*
 * ------------------------------------------------
 * Get item display data
 * ------------------------------------------------
 */

function getItemDisplayData(
  item
) {

  const product =
    item?.product ||
    {};


  const requestedItem =
    item?.requestedItem ||
    {};


  const productName =
    product.productName ||
    item?.productName ||
    requestedItem.item_name ||
    "Product";


  const requestedName =
    requestedItem.item_name ||
    null;


  const quantity =
    Number(
      item?.quantity ||
      requestedItem
        ?.item_quantity ||
      1
    ) || 1;


  const unitPrice =
    Number(
      item?.unitPrice ??
      product?.price ??
      0
    );


  const lineTotal =
    Number(
      item?.lineTotal ??
      item?.totalPrice ??
      (
        unitPrice *
        quantity
      )
    );


  const promotionalSavings =
    Number(
      item?.promotionalSavings ||
      0
    );


  const loyaltySavings =
    Number(
      item?.loyaltySavings ||
      product?.loyaltySavings ||
      0
    );


  const loyaltyApplied =
    item?.loyaltyApplied ===
    true;


  const promotionType =
    item?.promotionType ||
    product?.promotionType ||
    null;


  const promotionMechanic =
    item?.promotionMechanic ||
    product?.promotionMechanic ||
    null;


  const promotionQuantity =
    item?.promotionQuantity ??
    product?.promotionQuantity ??
    null;


  const promotionBundlePrice =
    item?.promotionBundlePrice ??
    product?.promotionBundlePrice ??
    null;


  const promotionMessage =
    item?.promotionMessage ||
    product?.promotionMessage ||
    null;


  const loyaltyPrice =
    item?.loyaltyPrice ??
    product?.loyaltyPrice ??
    null;


  const normalUnitPrice =
    item?.normalUnitPrice ??
    product?.price ??
    null;


  const qualifyingBundles =
    Number(
      item?.qualifyingBundles ||
      0
    );


  const remainingQuantity =
    Number(
      item?.remainingQuantity ||
      0
    );


  return {

    product,

    requestedItem,

    productName,

    requestedName,

    quantity,

    unitPrice,

    lineTotal,

    promotionalSavings,

    loyaltySavings,

    loyaltyApplied,

    promotionType,

    promotionMechanic,

    promotionQuantity,

    promotionBundlePrice,

    promotionMessage,

    loyaltyPrice,

    normalUnitPrice,

    qualifyingBundles,

    remainingQuantity,

  };
}


/*
 * ------------------------------------------------
 * Loyalty badge
 * ------------------------------------------------
 */

function LoyaltyBadge({
  children,
  retailer,
  strong = false,
}) {

  const loyalty =
    getLoyaltyDetails(
      retailer
    );


  return (

    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-2.5
        py-1
        text-xs
        ${
          strong
            ? "font-bold"
            : "font-semibold"
        }
      `}
      style={{
        backgroundColor:
          loyalty.background,

        color:
          loyalty.color,
      }}
    >
      {children}
    </span>

  );
}


function GrossaryPlusResults({
  results,
  savingPlan,
  onSelectPlan,
}) {

  /*
   * API may pass either:
   *
   * data.result
   *
   * OR
   *
   * the entire response.
   */

  const data =
    results?.result ||
    results;


  const optimization =
    data?.optimization;


  const optimized =
    optimization?.optimized;


  const allocations =
    normalizeAllocations(
      optimized?.allocations
    );


  /*
   * ------------------------------------------------
   * Totals
   * ------------------------------------------------
   */

  const total =
    Number(
      optimized?.total ||
      0
    );


  /*
   * ------------------------------------------------
   * Savings from allocated products
   * ------------------------------------------------
   */

  const itemSavings =
    allocations.reduce(
      (
        basketTotal,
        store
      ) => {

        const storeItems =
          Array.isArray(
            store?.items
          )
            ? store.items
            : [];


        const storeSavings =
          storeItems.reduce(
            (
              savingsTotal,
              item
            ) => {

              const itemData =
                getItemDisplayData(
                  item
                );


              return (
                savingsTotal +
                Number(
                  itemData
                    .promotionalSavings ||
                  0
                ) +
                Number(
                  itemData
                    .loyaltySavings ||
                  0
                )
              );

            },
            0
          );


        return (
          basketTotal +
          storeSavings
        );

      },
      0
    );


  /*
   * Savings created by Grossary choosing
   * cheaper stores.
   */

  const splitSavings =
    Number(
      optimized
        ?.combinationSavings ??
      optimization
        ?.combinationSavings ??
      0
    );


  /*
   * Total customer-facing Grossary+
   * savings.
   */

  const grossaryPlusSavings =
    itemSavings +
    splitSavings;


  const storesUsed =
    Number(
      optimized?.storesUsed ??
      optimized?.numberOfStores ??
      allocations.length
    );


  const cheapestSingleStore =
    optimization
      ?.singleStoreOptions
      ?.cheapest ||
    optimized
      ?.cheapestSingleStore ||
    null;


  const shoppingLocation =
    data?.shoppingLocation;


  const complete =
    optimization?.complete;


  const unmatchedItems =
    optimization
      ?.unmatchedItems ||
    [];


  /*
   * ------------------------------------------------
   * Invalid result
   * ------------------------------------------------
   */

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

        <div
          className="
            w-12
            h-12
            mx-auto
            rounded-2xl
            bg-red-50
            text-red-500
            flex
            items-center
            justify-center
            font-bold
            text-xl
            mb-4
          "
        >
          !
        </div>


        <p
          className="
            font-bold
            text-[#0B2E1E]
          "
        >
          We couldn&apos;t create your
          shopping plan.
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
          Here&apos;s your best shopping
          plan
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
              R{formatMoney(total)}
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


        {grossaryPlusSavings > 0 && (

          <div
            className="
              mt-6
              pt-5
              border-t
              border-white/10
            "
          >

            <div
              className="
                flex
                items-end
                justify-between
                gap-4
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    text-white/60
                  "
                >
                  Grossary+ savings
                </p>


                <p
                  className="
                    text-2xl
                    font-bold
                    text-[#1EC677]
                    mt-1
                  "
                >
                  R{formatMoney(
                    grossaryPlusSavings
                  )}
                </p>

              </div>


              {total > 0 && (

                <div
                  className="
                    bg-[#1EC677]/10
                    border
                    border-[#1EC677]/20
                    rounded-xl
                    px-3
                    py-2
                  "
                >

                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-wide
                      text-white/50
                    "
                  >
                    You save
                  </p>

                  <p
                    className="
                      text-sm
                      font-bold
                      text-[#1EC677]
                    "
                  >
                    {(
                      (
                        grossaryPlusSavings /
                        (
                          total +
                          grossaryPlusSavings
                        )
                      ) *
                      100
                    ).toFixed(0)}
                    %
                  </p>

                </div>

              )}

            </div>


            <p
              className="
                text-xs
                text-white/50
                mt-2
              "
            >
              Your total savings with this
              shopping plan
            </p>

          </div>

        )}

      </section>


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
                flex-shrink-0
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
                  ).toFixed(1)}
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
            Buy each item at the store where
            Grossary found the best price.
          </p>

        </div>


        {allocations.length > 0 ? (

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

                const isCheckers =
                  store.retailer ===
                  "Checkers";


                const storeDetails =
                  isCheckers
                    ? shoppingLocation
                        ?.checkers
                    : shoppingLocation
                        ?.pnp;


                const storeItems =
                  Array.isArray(
                    store.items
                  )
                    ? store.items
                    : [];


                const itemCount =
                  Number(
                    store.itemCount ??
                    storeItems.length
                  );


                const loyalty =
                  getLoyaltyDetails(
                    store.retailer
                  );


                return (

                  <div
                    key={
                      store.storeId ||
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
                        gap-4
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          min-w-0
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
                            flex-shrink-0
                          "
                        >
                          🛒
                        </div>


                        <div
                          className="
                            min-w-0
                          "
                        >

                          <p
                            className="
                              text-base
                              font-bold
                              text-[#0B2E1E]
                            "
                          >
                            {store.retailer}
                          </p>


                          {(store.branchName ||
                            storeDetails
                              ?.storeName) && (

                            <p
                              className="
                                text-xs
                                text-gray-500
                                mt-0.5
                                truncate
                              "
                            >
                              {store.branchName ||
                                storeDetails
                                  ?.storeName}
                            </p>

                          )}

                        </div>

                      </div>


                      <div
                        className="
                          text-right
                          flex-shrink-0
                        "
                      >

                        <p
                          className="
                            text-xs
                            text-gray-400
                          "
                        >
                          {itemCount}{" "}
                          {itemCount === 1
                            ? "item"
                            : "items"}
                        </p>


                        <p
                          className="
                            font-bold
                            text-[#0B2E1E]
                            mt-0.5
                          "
                        >
                          R{formatMoney(
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

                      {storeItems.map(
                        (
                          item,
                          itemIndex
                        ) => {

                          const itemData =
                            getItemDisplayData(
                              item
                            );


                          const hasLoyaltySaving =
                            itemData
                              .loyaltyApplied &&
                            itemData
                              .loyaltySavings >
                              0;


                          return (

                            <div
                              key={
                                itemData
                                  .requestedItem
                                  ?.id ||
                                item.productId ||
                                itemIndex
                              }
                              className="
                                px-5
                                py-4
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

                                {/* PRODUCT DETAILS */}

                                <div
                                  className="
                                    flex-1
                                    min-w-0
                                  "
                                >

                                  <p
                                    className="
                                      text-sm
                                      font-semibold
                                      text-[#0B2E1E]
                                    "
                                  >
                                    {
                                      itemData
                                        .productName
                                    }
                                  </p>


                                  {itemData.requestedName &&
                                    itemData
                                      .productName !==
                                      itemData
                                        .requestedName && (

                                    <p
                                      className="
                                        text-xs
                                        text-gray-400
                                        mt-1
                                      "
                                    >
                                      For:{" "}
                                      {
                                        itemData
                                          .requestedName
                                      }
                                    </p>

                                  )}


                                  {/* NORMAL PRICE / QUANTITY */}

                                  <p
                                    className="
                                      text-xs
                                      text-gray-500
                                      mt-1
                                    "
                                  >
                                    {itemData.quantity}

                                    {" × R"}

                                    {formatMoney(
                                      itemData
                                        .unitPrice
                                    )}
                                  </p>


                                  {/* ========================= */}
                                  {/* LOYALTY MULTIBUY */}
                                  {/* ========================= */}

                                  {itemData
                                    .loyaltyApplied &&
                                    itemData
                                      .promotionMechanic ===
                                      "MULTIBUY" && (

                                    <div
                                      className="
                                        mt-2
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                      "
                                    >

                                      <LoyaltyBadge
                                        retailer={
                                          store.retailer
                                        }
                                      >
                                        {
                                          loyalty.name
                                        }
                                        :{" "}

                                        {itemData
                                          .promotionMessage ||
                                          `${itemData.promotionQuantity} for R${formatMoney(
                                            itemData
                                              .promotionBundlePrice
                                          )}`}
                                      </LoyaltyBadge>


                                      {hasLoyaltySaving && (

                                        <LoyaltyBadge
                                          retailer={
                                            store.retailer
                                          }
                                          strong
                                        >
                                          Save R
                                          {formatMoney(
                                            itemData
                                              .loyaltySavings
                                          )}
                                        </LoyaltyBadge>

                                      )}

                                    </div>

                                  )}


                                  {/* ========================= */}
                                  {/* LOYALTY FIXED PRICE */}
                                  {/* ========================= */}

                                  {itemData
                                    .loyaltyApplied &&
                                    itemData
                                      .promotionMechanic ===
                                      "FIXED_PRICE" && (

                                    <div
                                      className="
                                        mt-2
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                      "
                                    >

                                      <LoyaltyBadge
                                        retailer={
                                          store.retailer
                                        }
                                      >
                                        {
                                          loyalty.name
                                        }{" "}

                                        R
                                        {formatMoney(
                                          itemData
                                            .loyaltyPrice ??
                                          itemData
                                            .unitPrice
                                        )}
                                      </LoyaltyBadge>


                                      {hasLoyaltySaving && (

                                        <LoyaltyBadge
                                          retailer={
                                            store.retailer
                                          }
                                          strong
                                        >
                                          Save R
                                          {formatMoney(
                                            itemData
                                              .loyaltySavings
                                          )}
                                        </LoyaltyBadge>

                                      )}

                                    </div>

                                  )}


                                  {/* ========================= */}
                                  {/* UNKNOWN LOYALTY MECHANIC */}
                                  {/* ========================= */}

                                  {itemData
                                    .loyaltyApplied &&
                                    ![
                                      "MULTIBUY",
                                      "FIXED_PRICE",
                                    ].includes(
                                      itemData
                                        .promotionMechanic
                                    ) && (

                                    <div
                                      className="
                                        mt-2
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                      "
                                    >

                                      <LoyaltyBadge
                                        retailer={
                                          store.retailer
                                        }
                                      >
                                        {
                                          loyalty.name
                                        }
                                        {itemData
                                          .promotionMessage
                                          ? `: ${itemData.promotionMessage}`
                                          : ""}
                                      </LoyaltyBadge>


                                      {hasLoyaltySaving && (

                                        <LoyaltyBadge
                                          retailer={
                                            store.retailer
                                          }
                                          strong
                                        >
                                          Save R
                                          {formatMoney(
                                            itemData
                                              .loyaltySavings
                                          )}
                                        </LoyaltyBadge>

                                      )}

                                    </div>

                                  )}


                                  {/* ========================= */}
                                  {/* STANDARD PROMOTION */}
                                  {/* ========================= */}

                                  {!itemData
                                    .loyaltyApplied &&
                                    itemData
                                      .promotionalSavings >
                                      0 && (

                                    <span
                                      className="
                                        inline-flex
                                        items-center
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
                                        itemData
                                          .promotionalSavings
                                      )}
                                    </span>

                                  )}

                                </div>


                                {/* LINE TOTAL */}

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
                                    R{formatMoney(
                                      itemData
                                        .lineTotal
                                    )}
                                  </p>


                                  {itemData
                                    .loyaltyApplied ? (

                                    <p
                                      className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        mt-1
                                      "
                                      style={{
                                        color:
                                          loyalty.color,
                                      }}
                                    >
                                      {
                                        loyalty.name
                                      }{" "}
                                      price
                                    </p>

                                  ) : (

                                    item.priceSource && (

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
                                        }{" "}
                                        price
                                      </p>

                                    )

                                  )}

                                </div>

                              </div>


                              {/* ========================= */}
                              {/* MULTIBUY EXPLANATION */}
                              {/* ========================= */}

                              {itemData
                                .loyaltyApplied &&
                                itemData
                                  .promotionMechanic ===
                                  "MULTIBUY" &&
                                itemData
                                  .qualifyingBundles >
                                  0 && (

                                <p
                                  className="
                                    text-xs
                                    text-gray-400
                                    mt-2
                                  "
                                >

                                  {itemData
                                    .qualifyingBundles}{" "}

                                  {itemData
                                    .qualifyingBundles ===
                                    1
                                    ? "qualifying bundle"
                                    : "qualifying bundles"}

                                  {itemData
                                    .remainingQuantity >
                                    0
                                    ? ` + ${itemData.remainingQuantity} at normal price`
                                    : ""}

                                </p>

                              )}

                            </div>

                          );

                        }
                      )}

                    </div>

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
              No store allocations were
              returned.
            </p>

          </div>

        )}

      </section>


      {/* ================================= */}
      {/* USE BEST OPTION */}
      {/* ================================= */}

      <button
        type="button"
        onClick={() =>
          onSelectPlan(
            total,
            grossaryPlusSavings
          )
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
          active:scale-[0.99]
          transition
          disabled:opacity-50
          disabled:cursor-not-allowed
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
                Complete the entire basket
                at one store.
              </p>

            </div>


            <p
              className="
                font-bold
                text-[#0B2E1E]
                whitespace-nowrap
              "
            >
              R{formatMoney(
                cheapestSingleStore
                  .total
              )}
            </p>

          </div>


          {splitSavings > 0 && (

            <div
              className="
                mt-4
                pt-4
                border-t
                border-gray-200
              "
            >

              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Grossary&apos;s recommended
                split saves you{" "}

                <span
                  className="
                    font-bold
                    text-[#1EC677]
                  "
                >
                  R{formatMoney(
                    splitSavings
                  )}
                </span>

                {" "}compared with shopping
                at one store.
              </p>

            </div>

          )}

        </section>

      )}


      {cheapestSingleStore && (

        <button
          type="button"
          onClick={() =>
            onSelectPlan(
              Number(
                cheapestSingleStore
                  ?.total ||
                0
              ),

              Number(
                cheapestSingleStore
                  ?.promotionalSavings ||
                0
              ) +

              Number(
                cheapestSingleStore
                  ?.loyaltySavings ||
                0
              )
            )
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
            active:scale-[0.99]
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {savingPlan
            ? "Updating your list..."
            : "Use Convenience Option"}
        </button>

      )}


      {/* ================================= */}
      {/* UNMATCHED ITEMS */}
      {/* ================================= */}

      {!complete &&
        unmatchedItems.length > 0 && (

        <section
          className="
            border
            border-orange-100
            bg-orange-50
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
                w-9
                h-9
                rounded-xl
                bg-orange-100
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              !
            </div>


            <div>

              <p
                className="
                  font-bold
                  text-[#0B2E1E]
                "
              >
                Some items couldn&apos;t be
                compared
              </p>


              <p
                className="
                  text-sm
                  text-gray-600
                  mt-1
                "
              >
                We couldn&apos;t confidently
                find prices for{" "}
                {unmatchedItems.length}{" "}
                {unmatchedItems.length === 1
                  ? "item"
                  : "items"}
                .
              </p>

            </div>

          </div>

        </section>

      )}

    </div>

  );
}


export default GrossaryPlusResults;