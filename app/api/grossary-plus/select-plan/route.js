import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/app/_utils/supabase/server";


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
          status:
            400,
        }
      );
    }


    const selectedBasketTotal =
      Number(
        basketTotal
      );


    const selectedSavings =
      Number(
        savings
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
          status:
            400,
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
          status:
            400,
        }
      );
    }


    const supabase =
      await createClient();


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
          status:
            400,
        }
      );
    }


    // =====================================
    // DETERMINE SELECTED OPTION
    // =====================================

    /*
     * The frontend no longer sends:
     *
     * "best"
     * or
     * "convenience"
     *
     * grossary_plus_plan now stores the
     * actual selected basket total.
     *
     * We therefore determine which option
     * was selected by comparing basketTotal
     * against the available options.
     */


    const optimized =
      optimization
        ?.optimized;


    const cheapestSingleStore =
      optimization
        ?.singleStoreOptions
        ?.cheapest;


    const optimizedTotal =
      Number(
        optimized?.total
      );


    const singleStoreTotal =
      Number(
        cheapestSingleStore
          ?.total
      );


    /*
     * Small tolerance protects us from
     * floating-point differences such as:
     *
     * 99.989999999
     * vs
     * 99.99
     */

    const totalsMatch = (
      first,
      second
    ) => {

      if (
        !Number.isFinite(
          first
        ) ||
        !Number.isFinite(
          second
        )
      ) {

        return false;
      }


      return (
        Math.abs(
          first -
          second
        ) < 0.01
      );
    };


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
     * the same, prefer the optimized plan.
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
          status:
            400,
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
        optimization
          ?.optimized
          ?.items
          ?.filter(
            item =>
              item.matched
          )
          .map(
            item => {

              const requestedItem =
                item.requestedItem;


              const product =
                item.product;


              const retailer =
                item.selectedRetailer ||
                item.retailer;


              const store =
                retailer ===
                "Checkers"
                  ? data
                      ?.shoppingLocation
                      ?.checkers
                  : data
                      ?.shoppingLocation
                      ?.pnp;


              return {

                itemId:
                  requestedItem?.id,

                retailer,

                storeId:
                  store?.storeId ||
                  item.storeId,

                storeName:
                  store?.storeName ||
                  retailer,

                price:
                  item.unitPrice,

                productName:
                  product
                    ?.productName ||
                  requestedItem
                    ?.item_name,
              };
            }
          ) ||
        [];

    } else {

      /*
       * ===================================
       * CONVENIENCE PLAN
       * ===================================
       */

      const cheapest =
        optimization
          ?.singleStoreOptions
          ?.cheapest;


      if (!cheapest) {

        return NextResponse.json(
          {
            error:
              "No complete single-store option is available.",
          },
          {
            status:
              400,
          }
        );
      }


      const retailer =
        cheapest.retailer;


      const basket =
        retailer ===
        "Checkers"
          ? optimization
              ?.baskets
              ?.checkers
          : optimization
              ?.baskets
              ?.pnp;


      const store =
        retailer ===
        "Checkers"
          ? data
              ?.shoppingLocation
              ?.checkers
          : data
              ?.shoppingLocation
              ?.pnp;


      recommendations =
        basket
          ?.matched
          ?.map(
            item => ({

              itemId:
                item
                  ?.requestedItem
                  ?.id,

              retailer,

              storeId:
                store?.storeId ||
                item.storeId,

              storeName:
                store?.storeName ||
                retailer,

              price:
                item.unitPrice,

              productName:
                item
                  ?.product
                  ?.productName ||
                item
                  ?.requestedItem
                  ?.item_name,
            })
          ) ||
        [];
    }


    // =====================================
    // UPDATE LIST ITEMS
    // =====================================

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

        throw error;
      }
    }


    // =====================================
    // SAVE SELECTED PLAN
    // =====================================

    /*
     * IMPORTANT:
     *
     * Previously:
     *
     * grossary_plus_plan = "best"
     *
     * or
     *
     * grossary_plus_plan = "convenience"
     *
     *
     * Now:
     *
     * grossary_plus_plan =
     * actual basket amount
     *
     * grossary_plus_savings =
     * actual selected savings
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
            Number(
              selectedBasketTotal
                .toFixed(2)
            ),

          grossary_plus_savings:
            Number(
              selectedSavings
                .toFixed(2)
            ),

        })
        .eq(
          "id",
          listId
        )
        .select(
          `
            id,
            grossary_plus_plan,
            grossary_plus_savings
          `
        )
        .single();


    if (listError) {

      throw listError;
    }


    // =====================================
    // SUCCESS
    // =====================================

    console.log(
      "Grossary Plus plan saved:",
      {

        listId,

        selectedPlan,

        basketTotal:
          selectedBasketTotal,

        savings:
          selectedSavings,

        recommendations:
          recommendations.length,

      }
    );


    return NextResponse.json({

      success:
        true,


      /*
       * Useful internally/debugging.
       *
       * We aren't storing this string in
       * user_lists anymore.
       */

      selectedPlan,


      basketTotal:
        Number(
          selectedBasketTotal
            .toFixed(2)
        ),


      savings:
        Number(
          selectedSavings
            .toFixed(2)
        ),


      recommendations,


      updatedCount:
        recommendations.length,


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
          error.message ||
          "Unable to save shopping plan.",
      },
      {
        status:
          500,
      }
    );
  }
}