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

    const {
      listId,
      plan,
      result,
    } =
      await request.json();


    if (
      !listId ||
      !plan
    ) {

      return NextResponse.json(
        {
          error:
            "listId and plan are required.",
        },
        {
          status:
            400,
        }
      );
    }


    if (
      ![
        "best",
        "convenience",
      ].includes(
        plan
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid Grossary Plus plan.",
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
    // BUILD ITEM RECOMMENDATIONS
    // =====================================

    let recommendations =
      [];


    if (
      plan ===
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
       * CONVENIENCE PLAN
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

    const {
      error:
        listError,
    } =
      await supabase
        .from(
          "user_lists"
        )
        .update({
          grossary_plus_plan:
            plan,
        })
        .eq(
          "id",
          listId
        );


    if (listError) {

      throw listError;
    }


    return NextResponse.json({

      success:
        true,

      plan,

      recommendations,

      updatedCount:
        recommendations.length,
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