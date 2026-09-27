import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/app/_utils/supabase/server";


/*
 * ------------------------------------------------
 * Money helper
 * ------------------------------------------------
 */

function roundMoney(value) {
  return Number(
    Number(value || 0).toFixed(2)
  );
}


/*
 * ------------------------------------------------
 * Compare monetary totals
 * ------------------------------------------------
 *
 * Protects against floating-point differences:
 *
 * 99.989999999
 *
 * vs
 *
 * 99.99
 * ------------------------------------------------
 */

function totalsMatch(
  first,
  second
) {
  const a =
    Number(first);

  const b =
    Number(second);

  if (
    !Number.isFinite(a) ||
    !Number.isFinite(b)
  ) {
    return false;
  }

  return (
    Math.abs(
      a - b
    ) < 0.01
  );
}


/*
 * ------------------------------------------------
 * Resolve shopping location store
 * ------------------------------------------------
 */

function getLocationStore(
  data,
  optimization,
  retailer
) {
  const shoppingLocation =
    data?.shoppingLocation ||
    optimization?.location ||
    null;

  if (!shoppingLocation) {
    return null;
  }

  if (
    retailer === "Checkers"
  ) {
    return (
      shoppingLocation
        ?.checkers ||
      null
    );
  }

  return (
    shoppingLocation
      ?.pnp ||
    null
  );
}


/*
 * ------------------------------------------------
 * Convert an optimized item into a recommendation
 * ------------------------------------------------
 */

function buildRecommendation({
  item,
  retailer = null,
  storeId = null,
  storeName = null,
}) {
  if (!item) {
    return null;
  }

  /*
   * Explicitly unmatched items must never
   * receive Grossary+ recommendation fields.
   */

  if (
    item.matched === false
  ) {
    return null;
  }

  const requestedItem =
    item?.requestedItem ||
    {};

  const product =
    item?.product ||
    {};

  const itemId =
    requestedItem?.id ||
    item?.itemId ||
    null;

  if (!itemId) {
    return null;
  }


  /*
   * Prefer information attached directly to
   * the optimized item.
   */

  const resolvedRetailer =
    item?.selectedRetailer ||
    item?.retailer ||
    retailer ||
    null;


  const resolvedStoreId =
    item?.storeId ||
    product?.storeId ||
    storeId ||
    null;


  const resolvedStoreName =
    item?.storeName ||
    item?.branchName ||
    product?.storeName ||
    product?.branchName ||
    storeName ||
    resolvedRetailer ||
    null;


  const price =
    Number(
      item?.unitPrice ??
      product?.price
    );


  if (
    !Number.isFinite(price)
  ) {
    return null;
  }


  const productName =
    product?.productName ||
    item?.productName ||
    requestedItem?.item_name ||
    null;


  return {
    itemId,

    retailer:
      resolvedRetailer,

    storeId:
      resolvedStoreId,

    storeName:
      resolvedStoreName,

    price:
      roundMoney(price),

    productName,
  };
}


/*
 * ------------------------------------------------
 * Build BEST OPTION recommendations
 * ------------------------------------------------
 */

function buildBestRecommendations({
  optimization,
  data,
}) {
  const items =
    Array.isArray(
      optimization
        ?.optimized
        ?.items
    )
      ? optimization
          .optimized
          .items
      : [];


  return items
    .filter(
      (item) =>
        item &&
        item.matched !== false
    )
    .map(
      (item) => {
        const retailer =
          item?.selectedRetailer ||
          item?.retailer ||
          null;

        const locationStore =
          getLocationStore(
            data,
            optimization,
            retailer
          );

        return buildRecommendation({
          item,

          retailer,

          storeId:
            locationStore?.storeId ||
            null,

          storeName:
            locationStore?.storeName ||
            retailer ||
            null,
        });
      }
    )
    .filter(Boolean);
}


/*
 * ------------------------------------------------
 * Build CONVENIENCE OPTION recommendations
 * ------------------------------------------------
 *
 * IMPORTANT:
 *
 * Do NOT rebuild this from:
 *
 * baskets.checkers.matched
 *
 * or
 *
 * baskets.pnp.matched
 *
 *
 * The optimizer now attaches the exact products
 * represented by the convenience total to:
 *
 * singleStoreOptions.cheapest.items
 *
 *
 * This matters when the convenience option is
 * partial.
 *
 * Example:
 *
 * User has 10 items.
 *
 * Checkers has 8.
 * PnP has 9.
 * Only 7 are fairly comparable at both stores.
 *
 * The convenience option may therefore represent
 * only those 7 items.
 *
 * We must update ONLY those 7 list_items.
 * ------------------------------------------------
 */

function buildConvenienceRecommendations({
  optimization,
  data,
}) {
  const convenience =
    optimization
      ?.singleStoreOptions
      ?.cheapest;

  if (!convenience) {
    return [];
  }


  const retailer =
    convenience?.retailer ||
    null;


  const locationStore =
    getLocationStore(
      data,
      optimization,
      retailer
    );


  const storeId =
    convenience?.storeId ||
    locationStore?.storeId ||
    null;


  const storeName =
    convenience?.storeName ||
    convenience?.branchName ||
    locationStore?.storeName ||
    retailer ||
    null;


  const items =
    Array.isArray(
      convenience?.items
    )
      ? convenience.items
      : [];


  return items
    .filter(
      (item) =>
        item &&
        item.matched !== false
    )
    .map(
      (item) =>
        buildRecommendation({
          item,
          retailer,
          storeId,
          storeName,
        })
    )
    .filter(Boolean);
}


/*
 * ------------------------------------------------
 * POST
 * ------------------------------------------------
 */

export async function POST(
  request
) {
  try {

    // =====================================
    // REQUEST BODY
    // =====================================

    const {
      listId,
      basketTotal,
      savings,
      result,
    } =
      await request.json();


    if (!listId) {
      return NextResponse.json(
        {
          error:
            "listId is required.",
        },
        {
          status: 400,
        }
      );
    }


    const selectedBasketTotal =
      Number(
        basketTotal
      );


    const selectedSavings =
      Number(
        savings ?? 0
      );


    if (
      !Number.isFinite(
        selectedBasketTotal
      ) ||
      selectedBasketTotal < 0
    ) {
      return NextResponse.json(
        {
          error:
            "A valid basketTotal is required.",
        },
        {
          status: 400,
        }
      );
    }


    if (
      !Number.isFinite(
        selectedSavings
      ) ||
      selectedSavings < 0
    ) {
      return NextResponse.json(
        {
          error:
            "A valid savings amount is required.",
        },
        {
          status: 400,
        }
      );
    }


    // =====================================
    // RESULT
    // =====================================

    const data =
      result?.result ||
      result;


    const optimization =
      data?.optimization;


    if (!optimization) {
      return NextResponse.json(
        {
          error:
            "Optimization result is missing.",
        },
        {
          status: 400,
        }
      );
    }


    const optimized =
      optimization?.optimized;


    if (!optimized) {
      return NextResponse.json(
        {
          error:
            "Optimized shopping plan is missing.",
        },
        {
          status: 400,
        }
      );
    }


    // =====================================
    // DETERMINE SELECTED OPTION
    // =====================================

    /*
     * The frontend sends the monetary value,
     * rather than:
     *
     * "best"
     *
     * or
     *
     * "convenience".
     *
     * grossary_plus_plan therefore continues
     * to store the actual selected basket
     * amount.
     */


    const cheapestSingleStore =
      optimization
        ?.singleStoreOptions
        ?.cheapest ||
      null;


    const optimizedTotal =
      Number(
        optimized?.total
      );


    const singleStoreTotal =
      Number(
        cheapestSingleStore
          ?.total
      );


    const selectedBestPlan =
      totalsMatch(
        selectedBasketTotal,
        optimizedTotal
      );


    const selectedConveniencePlan =
      totalsMatch(
        selectedBasketTotal,
        singleStoreTotal
      );


    /*
     * If both totals happen to be exactly
     * equal, the monetary values alone cannot
     * distinguish which button was clicked.
     *
     * We preserve the existing behaviour and
     * prefer Best Option.
     */

    let selectedPlan =
      null;


    if (
      selectedBestPlan
    ) {
      selectedPlan =
        "best";

    } else if (
      selectedConveniencePlan
    ) {
      selectedPlan =
        "convenience";
    }


    if (!selectedPlan) {
      console.error(
        "Unable to identify selected Grossary+ option:",
        {
          selectedBasketTotal,
          optimizedTotal,
          singleStoreTotal,
        }
      );

      return NextResponse.json(
        {
          error:
            "The selected shopping plan could not be identified.",
        },
        {
          status: 400,
        }
      );
    }


    // =====================================
    // BUILD ITEM RECOMMENDATIONS
    // =====================================

    let recommendations =
      [];


    if (
      selectedPlan ===
      "best"
    ) {
      recommendations =
        buildBestRecommendations({
          optimization,
          data,
        });

    } else {

      /*
       * Convenience can now be either:
       *
       * COMPLETE
       *
       * or
       *
       * PARTIAL
       *
       * Both are valid.
       */

      if (
        !cheapestSingleStore
      ) {
        return NextResponse.json(
          {
            error:
              "No single-store convenience option is available.",
          },
          {
            status: 400,
          }
        );
      }


      recommendations =
        buildConvenienceRecommendations({
          optimization,
          data,
        });
    }


    /*
     * A selected plan should always contain
     * at least one matched item.
     */

    if (
      recommendations.length ===
      0
    ) {
      return NextResponse.json(
        {
          error:
            "No matched products were available for the selected shopping plan.",
        },
        {
          status: 400,
        }
      );
    }


    // =====================================
    // SUPABASE
    // =====================================

    const supabase =
      await createClient();


    // =====================================
    // UPDATE LIST ITEMS
    // =====================================

    /*
     * IMPORTANT:
     *
     * Only items included in the selected
     * plan are updated.
     *
     * For a partial convenience option this
     * means excluded products are left alone.
     */


    let updatedCount =
      0;


    for (
      const recommendation
      of recommendations
    ) {
      if (
        !recommendation.itemId
      ) {
        continue;
      }


      const {
        error,
      } =
        await supabase
          .from(
            "list_items"
          )
          .update({
            recommended_retailer:
              recommendation
                .retailer,

            recommended_store_id:
              recommendation
                .storeId,

            recommended_store_name:
              recommendation
                .storeName,

            recommended_price:
              recommendation
                .price,

            recommended_product_name:
              recommendation
                .productName,

            recommendation_source:
              "grossary_plus",
          })
          .eq(
            "id",
            recommendation
              .itemId
          )
          .eq(
            "list_id",
            listId
          );


      if (error) {
        console.error(
          "Failed to update Grossary+ item recommendation:",
          {
            listId,

            recommendation,

            error,
          }
        );

        throw error;
      }


      updatedCount += 1;
    }


    // =====================================
    // SAVE SELECTED PLAN
    // =====================================

    /*
     * grossary_plus_plan
     *
     * stores the actual selected basket
     * amount.
     *
     *
     * grossary_plus_savings
     *
     * stores the actual savings associated
     * with the selected option.
     *
     *
     * We do NOT store:
     *
     * "best"
     *
     * or
     *
     * "convenience"
     *
     * in these numeric columns.
     */


    const {
      data:
        updatedList,

      error:
        listError,
    } =
      await supabase
        .from(
          "user_lists"
        )
        .update({
          grossary_plus_plan:
            roundMoney(
              selectedBasketTotal
            ),

          grossary_plus_savings:
            roundMoney(
              selectedSavings
            ),
        })
        .eq(
          "id",
          listId
        )
        .select(`
          id,
          grossary_plus_plan,
          grossary_plus_savings
        `)
        .single();


    if (listError) {
      console.error(
        "Failed to update Grossary+ list:",
        {
          listId,
          listError,
        }
      );

      throw listError;
    }


    // =====================================
    // SELECTED OPTION INFORMATION
    // =====================================

    const selectedOption =
      selectedPlan ===
      "convenience"
        ? cheapestSingleStore
        : optimized;


    const partial =
      selectedPlan ===
        "convenience"
        ? (
            cheapestSingleStore
              ?.partial ===
              true ||
            cheapestSingleStore
              ?.complete ===
              false
          )
        : (
            optimization
              ?.complete ===
              false
          );


    const matchedCount =
      selectedPlan ===
        "convenience"
        ? Number(
            cheapestSingleStore
              ?.matchedCount ??
            recommendations.length
          )
        : recommendations.length;


    const totalItemCount =
      Number(
        optimization?.itemCount ??
        (
          optimization
            ?.matchedCount != null &&
          optimization
            ?.unmatchedCount != null
            ? Number(
                optimization
                  .matchedCount
              ) +
              Number(
                optimization
                  .unmatchedCount
              )
            : 0
        )
      );


    const excludedCount =
      selectedPlan ===
        "convenience"
        ? Number(
            cheapestSingleStore
              ?.unmatchedCount ??
            Math.max(
              0,
              totalItemCount -
              matchedCount
            )
          )
        : Number(
            optimization
              ?.unmatchedCount ??
            optimization
              ?.unmatchedItems
              ?.length ??
            0
          );


    // =====================================
    // SUCCESS
    // =====================================

    console.log(
      "Grossary Plus plan saved:",
      {
        listId,

        selectedPlan,

        partial,

        basketTotal:
          selectedBasketTotal,

        savings:
          selectedSavings,

        recommendations:
          recommendations.length,

        matchedCount,

        excludedCount,
      }
    );


    return NextResponse.json({
      success:
        true,


      /*
       * Useful internally/debugging.
       *
       * This string is NOT stored in
       * grossary_plus_plan.
       */

      selectedPlan,


      /*
       * Lets the frontend know whether the
       * selected recommendation represented
       * the full requested list.
       */

      partial,


      basketTotal:
        roundMoney(
          selectedBasketTotal
        ),


      savings:
        roundMoney(
          selectedSavings
        ),


      matchedCount,

      excludedCount,


      /*
       * Number of list_items that actually
       * received Grossary+ recommendations.
       */

      updatedCount,


      recommendations,


      selectedOption: {
        retailer:
          selectedOption
            ?.retailer ||
          null,

        storeId:
          selectedOption
            ?.storeId ||
          null,

        storeName:
          selectedOption
            ?.storeName ||
          selectedOption
            ?.branchName ||
          null,

        complete:
          !partial,
      },


      list:
        updatedList,
    });


  } catch (error) {
    console.error(
      "Grossary Plus select plan error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to save shopping plan.",
      },
      {
        status: 500,
      }
    );
  }
}