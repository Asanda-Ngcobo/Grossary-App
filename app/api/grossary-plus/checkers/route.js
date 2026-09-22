import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const {
  getCheckersBasket,
} = require(
  "@/app/_lib/grocery/services/getCheckersBasket"
);


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);


export async function POST(request) {
  try {

    /*
     * ------------------------------------------
     * Get list ID
     * ------------------------------------------
     */

    const body =
      await request.json();

    const {
      listId,
    } = body;


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


    /*
     * ------------------------------------------
     * Get Grossary list
     * ------------------------------------------
     */

    const {
      data: list,
      error: listError,
    } =
      await supabase
        .from("user_lists")
        .select(`
          id,
          list_name,
          list_budget,
          user_id
        `)
        .eq("id", listId)
        .single();


    if (listError || !list) {
      console.error(
        "List error:",
        listError
      );

      return NextResponse.json(
        {
          error:
            "List not found.",
        },
        {
          status: 404,
        }
      );
    }


    /*
     * ------------------------------------------
     * Get list items
     * ------------------------------------------
     */

    const {
      data: listItems,
      error: itemsError,
    } =
      await supabase
        .from("list_items")
        .select(`
          id,
          item_name,
          item_brand,
          item_quantity,
          item_volume_mass,
          item_unit,
          item_category
        `)
        .eq(
          "list_id",
          listId
        );


    if (itemsError) {
      console.error(
        "List items error:",
        itemsError
      );

      return NextResponse.json(
        {
          error:
            "Could not load list items.",
        },
        {
          status: 500,
        }
      );
    }


    if (
      !listItems ||
      listItems.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "This list has no items.",
        },
        {
          status: 400,
        }
      );
    }


    /*
     * ------------------------------------------
     * Price list at Checkers
     * ------------------------------------------
     */

    const basket =
      await getCheckersBasket(
        listItems
      );


    /*
     * ------------------------------------------
     * Budget calculations
     * ------------------------------------------
     */

    const budget =
      Number(
        list.list_budget
      ) || 0;


    const moneyLeft =
      budget > 0
        ? budget -
          basket.total
        : null;


    const withinBudget =
      budget > 0
        ? basket.total <=
          budget
        : null;


    /*
     * ------------------------------------------
     * Response
     * ------------------------------------------
     */

    return NextResponse.json({
      success: true,

      list: {
        id:
          list.id,

        name:
          list.list_name,

        budget,
      },

      basket: {
        ...basket,

        moneyLeft:
          moneyLeft !== null
            ? Number(
                moneyLeft.toFixed(2)
              )
            : null,

        withinBudget,
      },
    });

  } catch (error) {

    console.error(
      "Grossary Plus Checkers error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Could not price this list at Checkers.",

        details:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}