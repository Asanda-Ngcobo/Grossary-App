import {
  NextResponse,
} from "next/server";

import {
  createClient as createAdminClient,
} from "@supabase/supabase-js";

import {
  createClient as createServerClient,
} from "@/app/_utils/supabase/server";

import sharedLocationService
  from "@/app/_lib/grocery/services/findSharedShoppingLocations";

import optimizerService
  from "@/app/_lib/grocery/services/optimizeShoppingLocation";


const {
  findSharedShoppingLocations,
} =
  sharedLocationService;


const {
  optimizeShoppingLocation,
} =
  optimizerService;


// ========================================
// ADMIN SUPABASE CLIENT
// ========================================

/*
 * Used for backend database operations.
 *
 * IMPORTANT:
 * This client uses the service role key,
 * so it bypasses RLS.
 *
 * We therefore explicitly verify that
 * the requested grocery list belongs
 * to the authenticated user.
 */

const adminSupabase =
  createAdminClient(
    process.env
      .NEXT_PUBLIC_SUPABASE_URL,

    process.env
      .SUPABASE_SERVICE_ROLE_KEY
  );


// ========================================
// POST /api/grossary-plus
// ========================================

export async function POST(
  request
) {

  try {

    console.log(
      "================================="
    );

    console.log(
      "Starting Grossary Plus API..."
    );

    console.log(
      "================================="
    );


    // =====================================
    // 1. GET AUTHENTICATED USER
    // =====================================

    /*
     * This is your SSR Supabase client.
     *
     * Unlike the admin client above,
     * this client reads the user's
     * Supabase auth cookies.
     */

    const authSupabase =
      await createServerClient();


    const {
      data: {
        user,
      },
      error:
        authError,
    } =
      await authSupabase
        .auth
        .getUser();


    console.log(
      "Grossary Plus auth:",
      {
        userId:
          user?.id ||
          null,

        email:
          user?.email ||
          null,

        authError:
          authError ||
          null,
      }
    );


    if (
      authError ||
      !user
    ) {

      console.error(
        "Grossary Plus unauthorized:",
        authError
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "UNAUTHORIZED",

          message:
            "You must be logged in to use Grossary Plus.",
        },
        {
          status:
            401,
        }
      );
    }


    // =====================================
    // 2. GET USER'S GROSSARY PLUS STATUS
    // =====================================

    /*
     * Your current Grossary database
     * uses users_info.
     *
     * The authenticated Supabase user ID
     * should match users_info.id.
     */const {
  data: profile,
  error: profileError,
} =
  await adminSupabase
    .from("users_info")
    .select(`
      id,
      is_plus,
      plus_status,
      plus_trial_ends_at,
      plus_current_period_start,
      plus_current_period_end,
      plus_cancel_at_period_end
    `)
    .eq(
      "id",
      user.id
    )
    .single();

    console.log(
      "Grossary Plus profile:",
      {
        userId:
          user.id,

        profile:
          profile ||
          null,

        profileError:
          profileError ||
          null,
      }
    );


    if (
      profileError ||
      !profile
    ) {

      console.error(
        "Unable to load Grossary Plus profile:",
        profileError
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "PROFILE_NOT_FOUND",

          message:
            "Unable to verify your Grossary Plus subscription.",
        },
        {
          status:
            500,
        }
      );
    }


    // =====================================
    // 3. CHECK GROSSARY PLUS ACCESS
    // =====================================

    /*
     * Users have access when:
     *
     * is_plus = true
     *
     * AND
     *
     * plus_status = active
     * OR
     * plus_status = trialing
     */

    const validPlusStatus =
      profile.plus_status ===
        "active" ||
      profile.plus_status ===
        "trialing";

// ========================================
// CHECK GROSSARY PLUS ACCESS
// ========================================

const now =
  new Date();


let hasPlusAccess =
  false;


let accessReason =
  null;


// ========================================
// ACTIVE TRIAL
// ========================================

if (
  profile.is_plus === true &&
  profile.plus_status === "trialing"
) {

  const trialEndsAt =
    profile.plus_trial_ends_at
      ? new Date(
          profile.plus_trial_ends_at
        )
      : null;


  if (
    trialEndsAt &&
    !Number.isNaN(
      trialEndsAt.getTime()
    ) &&
    trialEndsAt > now
  ) {

    hasPlusAccess =
      true;

    accessReason =
      "active_trial";

  } else {

    /*
     * Trial has expired.
     *
     * Until Paystack confirms the first
     * R39 payment, don't continue giving
     * Plus access.
     */

    console.log(
      "Grossary Plus trial expired:",
      {
        userId:
          user.id,

        trialEndsAt:
          profile.plus_trial_ends_at,
      }
    );


    // Keep DB state from lying about access.

    const {
      error:
        expireError,
    } =
      await adminSupabase
        .from(
          "users_info"
        )
      .update({

  is_plus:
    false,

  plus_status:
    profile.plus_cancel_at_period_end
      ? "cancelled"
      : "trial_expired",

})
        .eq(
          "id",
          user.id
        )
        .eq(
          "plus_status",
          "trialing"
        );


    if (
      expireError
    ) {

      console.error(
        "Failed to mark Grossary Plus trial expired:",
        expireError
      );

    }
  }
}


// ========================================
// ACTIVE PAID SUBSCRIPTION
// ========================================

if (
  profile.is_plus === true &&
  profile.plus_status === "active"
) {

  const periodEnd =
    profile.plus_current_period_end
      ? new Date(
          profile.plus_current_period_end
        )
      : null;


  /*
   * Once we're using webhooks in
   * production, an active subscription
   * should have a billing period end.
   */

  if (
    periodEnd &&
    !Number.isNaN(
      periodEnd.getTime()
    ) &&
    periodEnd > now
  ) {

    hasPlusAccess =
      true;

    accessReason =
      "active_subscription";

  } else {

    console.log(
      "Grossary Plus paid period expired:",
      {
        userId:
          user.id,

        periodEnd:
          profile.plus_current_period_end,
      }
    );


    const {
      error:
        expireError,
    } =
      await adminSupabase
        .from(
          "users_info"
        )
.update({

  is_plus:
    false,

  plus_status:
    profile.plus_cancel_at_period_end
      ? "cancelled"
      : "expired",

})
        .eq(
          "id",
          user.id
        )
        .eq(
          "plus_status",
          "active"
        );


    if (
      expireError
    ) {

      console.error(
        "Failed to expire Grossary Plus:",
        expireError
      );

    }
  }
}


// ========================================
// PAST-DUE GRACE PERIOD
// ========================================

if (
  profile.is_plus === true &&
  profile.plus_status === "past_due"
) {

  const periodEnd =
    profile.plus_current_period_end
      ? new Date(
          profile.plus_current_period_end
        )
      : null;


  if (
    periodEnd &&
    !Number.isNaN(
      periodEnd.getTime()
    )
  ) {

    const gracePeriodEnd =
      new Date(
        periodEnd
      );


    gracePeriodEnd.setDate(
      gracePeriodEnd.getDate() +
      3
    );


    if (
      gracePeriodEnd > now
    ) {

      hasPlusAccess =
        true;

      accessReason =
        "payment_grace_period";

    } else {

      const {
        error:
          expireError,
      } =
        await adminSupabase
          .from(
            "users_info"
          )
          .update({

            is_plus:
              false,

            plus_status:
              "past_due_expired",

          })
          .eq(
            "id",
            user.id
          )
          .eq(
            "plus_status",
            "past_due"
          );


      if (
        expireError
      ) {

        console.error(
          "Failed to expire past-due Grossary Plus:",
          expireError
        );

      }
    }
  }
}


// ========================================
// DENY ACCESS
// ========================================

if (
  !hasPlusAccess
) {

  console.log(
    "Grossary Plus access denied:",
    {
      userId:
        user.id,

      status:
        profile.plus_status,

      isPlus:
        profile.is_plus,
    }
  );


  return NextResponse.json(
    {
      success:
        false,

      error:
        "PLUS_REQUIRED",

      plusStatus:
        profile.plus_status,

      redirectTo:
        "/account/forms/subscribe",
    },
    {
      status:
        403,
    }
  );
}


console.log(
  "Grossary Plus access granted:",
  {
    userId:
      user.id,

    reason:
      accessReason,
  }
);


    // =====================================
    // 4. READ REQUEST BODY
    // =====================================

    const body =
      await request.json();


    const {
      listId,
      latitude,
      longitude,
    } =
      body;


    console.log(
      "Grossary Plus request:",
      {
        listId,
        latitude,
        longitude,
      }
    );


    // =====================================
    // 5. VALIDATE LIST ID
    // =====================================

    if (!listId) {

      return NextResponse.json(
        {
          success:
            false,

          error:
            "LIST_ID_REQUIRED",

          message:
            "List ID is required.",
        },
        {
          status:
            400,
        }
      );
    }


    // =====================================
    // 6. VALIDATE LOCATION
    // =====================================

    const userLatitude =
      Number(
        latitude
      );


    const userLongitude =
      Number(
        longitude
      );


    if (
      !Number.isFinite(
        userLatitude
      ) ||
      !Number.isFinite(
        userLongitude
      )
    ) {

      return NextResponse.json(
        {
          success:
            false,

          error:
            "INVALID_LOCATION",

          message:
            "Valid latitude and longitude are required.",
        },
        {
          status:
            400,
        }
      );
    }


    console.log(
      "Grossary Plus coordinates:"
    );

    console.log(
      "latitude:",
      userLatitude
    );

    console.log(
      "longitude:",
      userLongitude
    );


    // =====================================
    // 7. GET USER'S LIST
    // =====================================

    /*
     * Because adminSupabase bypasses RLS,
     * we explicitly require:
     *
     * user_lists.user_id = user.id
     *
     * This prevents one Plus user from
     * accessing another user's list.
     */

    const {
      data:
        list,

      error:
        listError,
    } =
      await adminSupabase
        .from(
          "user_lists"
        )
        .select(`
          id,
          list_name,
          list_budget,
          user_id
        `)
        .eq(
          "id",
          listId
        )
        .eq(
          "user_id",
          user.id
        )
        .single();


    if (
      listError ||
      !list
    ) {

      console.error(
        "Grossary Plus list error:",
        listError
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "LIST_NOT_FOUND",

          message:
            "The grocery list could not be found.",
        },
        {
          status:
            404,
        }
      );
    }


    console.log(
      "Grossary Plus list:",
      {
        id:
          list.id,

        name:
          list.list_name,

        budget:
          list.list_budget,

        userId:
          list.user_id,
      }
    );


    // =====================================
    // 8. GET LIST ITEMS
    // =====================================

    const {
      data:
        items,

      error:
        itemsError,
    } =
      await adminSupabase
        .from(
          "list_items"
        )
        .select(`
          id,
          list_id,
          item_name,
          item_category,
          item_brand,
          item_quantity,
          item_volume_mass,
          item_unit
        `)
        .eq(
          "list_id",
          listId
        );


    if (
      itemsError
    ) {

      console.error(
        "Grossary Plus list items error:",
        itemsError
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "ITEMS_LOAD_FAILED",

          message:
            "Could not load grocery list items.",
        },
        {
          status:
            500,
        }
      );
    }


    if (
      !items ||
      items.length ===
        0
    ) {

      return NextResponse.json(
        {
          success:
            false,

          error:
            "EMPTY_LIST",

          message:
            "This grocery list has no items.",
        },
        {
          status:
            400,
        }
      );
    }


    console.log(
      "Grossary Plus items:",
      items.length
    );


    // =====================================
    // 9. FIND SHARED SHOPPING LOCATIONS
    // =====================================

    console.log(
      "Finding nearby Grossary Plus locations..."
    );


    const discovery =
      await findSharedShoppingLocations(
        userLatitude,
        userLongitude
      );


    if (
      !discovery ||
      !Array.isArray(
        discovery
          .sharedLocations
      ) ||
      discovery
        .sharedLocations
        .length ===
        0
    ) {

      console.log(
        "No shared shopping locations found."
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "NO_SHARED_LOCATION",

          message:
            "No nearby shopping location with both Checkers and Pick n Pay was found.",
        },
        {
          status:
            404,
        }
      );
    }


    console.log(
      "Shared shopping locations:",
      discovery
        .sharedLocations
        .length
    );


    // =====================================
    // 10. SELECT NEAREST LOCATION
    // =====================================

    /*
     * findSharedShoppingLocations()
     * already sorts locations by
     * distance from the user.
     */

    const nearest =
      discovery
        .sharedLocations[0];


    console.log(
      "Nearest Grossary Plus location:"
    );


    console.log({
      checkers:
        nearest
          .checkers
          ?.storeName,

      checkersId:
        nearest
          .checkers
          ?.providerStoreId,

      pnp:
        nearest
          .pnp
          ?.storeName,

      pnpId:
        nearest
          .pnp
          ?.providerStoreId,

      distanceFromUserKm:
        nearest
          .distanceFromUserKm,

      distanceBetweenStoresKm:
        nearest
          .distanceKm,
    });


    // =====================================
    // 11. VALIDATE STORE IDS
    // =====================================

    const checkersStoreId =
      nearest
        ?.checkers
        ?.providerStoreId;


    const pnpStoreId =
      nearest
        ?.pnp
        ?.providerStoreId;


    if (
      !checkersStoreId ||
      !pnpStoreId
    ) {

      console.error(
        "Shared location is missing retailer store IDs."
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "INVALID_SHARED_LOCATION",

          message:
            "The selected shopping location is missing retailer information.",
        },
        {
          status:
            500,
        }
      );
    }


    // =====================================
    // 12. BUILD OPTIMIZER LOCATION
    // =====================================

    const location = {

      /*
       * Until Grossary has a canonical
       * shopping-centre name, use the
       * Checkers location/name.
       */

      name:
        nearest
          .checkers
          ?.location ||
        nearest
          .checkers
          ?.storeName ||
        nearest
          .pnp
          ?.storeName ||
        "Shopping location",


      distanceKm:
        nearest
          .distanceFromUserKm,


      distanceBetweenStoresKm:
        nearest
          .distanceKm,


      checkers: {

        storeId:
          checkersStoreId,

        storeName:
          nearest
            .checkers
            ?.storeName ||
          "Checkers",

        location:
          nearest
            .checkers
            ?.location ||
          null,

        latitude:
          nearest
            .checkers
            ?.latitude,

        longitude:
          nearest
            .checkers
            ?.longitude,
      },


      pnp: {

        storeId:
          pnpStoreId,

        storeName:
          nearest
            .pnp
            ?.storeName ||
          "Pick n Pay",

        street:
          nearest
            .pnp
            ?.address
            ?.street ||
          null,

        latitude:
          nearest
            .pnp
            ?.latitude,

        longitude:
          nearest
            .pnp
            ?.longitude,
      },
    };


    console.log(
      "Optimizer location:",
      location
    );


    // =====================================
    // 13. PRICE + OPTIMIZE
    // =====================================

    console.log(
      "Starting basket optimization..."
    );


    const optimization =
      await optimizeShoppingLocation({
        items,
        location,
      });


    if (
      !optimization
    ) {

      console.error(
        "Optimizer returned no result."
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "OPTIMIZATION_FAILED",

          message:
            "Grossary Plus could not optimize this grocery list.",
        },
        {
          status:
            500,
        }
      );
    }


    console.log(
      "Grossary Plus optimization complete:",
      {
        complete:
          optimization
            .complete,

        itemCount:
          optimization
            .itemCount,

        matchedCount:
          optimization
            .matchedCount,

        unmatchedCount:
          optimization
            .unmatchedCount,

        optimizedTotal:
          optimization
            ?.optimized
            ?.total,

        storesUsed:
          optimization
            ?.optimized
            ?.storesUsed,

        promotionalSavings:
          optimization
            ?.optimized
            ?.promotionalSavings,

        combinationSavings:
          optimization
            ?.combinationSavings,
      }
    );


    // =====================================
    // 14. RESPONSE
    // =====================================

    return NextResponse.json(
      {
        success:
          true,


        result: {

          // -------------------------------
          // LIST
          // -------------------------------

          list: {

            id:
              list.id,

            name:
              list
                .list_name,

            budget:
              list
                .list_budget,

            itemCount:
              items.length,
          },


          // -------------------------------
          // USER LOCATION
          // -------------------------------

          userLocation:
            discovery
              .userLocation,


          // -------------------------------
          // SELECTED SHOPPING LOCATION
          // -------------------------------

          shoppingLocation:
            location,


          // -------------------------------
          // OPTIMIZED SHOPPING PLAN
          // -------------------------------

          optimization,


          // -------------------------------
          // LOCATION DISCOVERY INFO
          // -------------------------------

          sharedLocationCount:
            discovery
              .sharedLocations
              .length,
        },
      },
      {
        status:
          200,
      }
    );


  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "Grossary Plus error:",
      error
    );

    console.error(
      "================================="
    );


    return NextResponse.json(
      {
        success:
          false,

        error:
          "GROSSARY_PLUS_ERROR",

        message:
          error?.message ||
          "Grossary Plus failed.",
      },
      {
        status:
          500,
      }
    );
  }
}