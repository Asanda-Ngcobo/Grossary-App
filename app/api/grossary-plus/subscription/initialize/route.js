import {
  NextResponse,
} from "next/server";

import {
  createClient as createServerClient,
} from "@/app/_utils/supabase/server";

import {
  createClient as createAdminClient,
} from "@supabase/supabase-js";


const adminSupabase =
  createAdminClient(
    process.env
      .NEXT_PUBLIC_SUPABASE_URL,

    process.env
      .SUPABASE_SERVICE_ROLE_KEY
  );


export async function POST(
  request
) {

  try {

    // =====================================
    // 1. AUTHENTICATE USER
    // =====================================

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


    if (
      authError ||
      !user
    ) {

      return NextResponse.json(
        {
          success:
            false,

          error:
            "UNAUTHORIZED",
        },
        {
          status:
            401,
        }
      );
    }


    // =====================================
    // 2. LOAD USER
    // =====================================

    const {
      data:
        profile,

      error:
        profileError,
    } =
      await adminSupabase
        .from(
          "users_info"
        )
        .select(`
          id,
          is_plus,
          plus_status,
          plus_trial_used
        `)
        .eq(
          "id",
          user.id
        )
        .single();


    if (
      profileError ||
      !profile
    ) {

      console.error(
        "Profile error:",
        profileError
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "PROFILE_NOT_FOUND",
        },
        {
          status:
            404,
        }
      );
    }


    // =====================================
    // 3. ALREADY HAS PLUS
    // =====================================

    if (
      profile.is_plus ===
        true &&
      (
        profile.plus_status ===
          "active" ||
        profile.plus_status ===
          "trialing"
      )
    ) {

      return NextResponse.json(
        {
          success:
            false,

          error:
            "ALREADY_SUBSCRIBED",

          message:
            "You already have Grossary Plus.",
        },
        {
          status:
            409,
        }
      );
    }


    // =====================================
    // 4. TRIAL ELIGIBILITY
    // =====================================

    const trialEligible =
      profile.plus_trial_used !==
      true;


    // =====================================
    // 5. CALLBACK URL
    // =====================================

    const body =
      await request
        .json()
        .catch(
          () => ({})
        );


    const returnTo =
      typeof body?.returnTo ===
        "string"
        ? body.returnTo
        : "/";


    const appUrl =
      process.env
        .NEXT_PUBLIC_APP_URL;


    if (!appUrl) {

      throw new Error(
        "NEXT_PUBLIC_APP_URL is not configured."
      );
    }


    const callbackUrl =
      new URL(
        "/account/forms/subscribe/callback",
        appUrl
      );


    callbackUrl
      .searchParams
      .set(
        "returnTo",
        returnTo
      );


    // =====================================
    // 6. INITIALIZE R1 VERIFICATION
    // =====================================

    /*
     * R1 = 100 cents.
     *
     * DO NOT include the R39 Paystack
     * plan here.
     *
     * This transaction exists to obtain
     * a reusable card authorization.
     */

    const paystackResponse =
      await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method:
            "POST",

          headers: {

            Authorization:
              `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({

              email:
                user.email,

              amount:
                100,

              currency:
                "ZAR",

              callback_url:
                callbackUrl
                  .toString(),

              metadata: {

                purpose:
                  "grossary_plus_card_verification",

                grossary_user_id:
                  user.id,

                trial_eligible:
                  trialEligible,

                return_to:
                  returnTo,
              },
            }),
        }
      );


    const paystackData =
      await paystackResponse
        .json();


    console.log(
      "Paystack initialize:",
      paystackData
    );


    if (
      !paystackResponse.ok ||
      !paystackData.status
    ) {

      console.error(
        "Paystack initialization failed:",
        paystackData
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "PAYSTACK_INITIALIZATION_FAILED",

          message:
            paystackData
              ?.message ||
            "Unable to start Paystack checkout.",
        },
        {
          status:
            500,
        }
      );
    }


    // =====================================
    // 7. RETURN CHECKOUT URL
    // =====================================

    return NextResponse.json({
      success:
        true,

      trialEligible,

      authorizationUrl:
        paystackData
          .data
          .authorization_url,

      reference:
        paystackData
          .data
          .reference,
    });


  } catch (error) {

    console.error(
      "Grossary Plus subscription initialization error:",
      error
    );


    return NextResponse.json(
      {
        success:
          false,

        error:
          "SUBSCRIPTION_INITIALIZATION_ERROR",

        message:
          error?.message ||
          "Unable to start Grossary Plus subscription.",
      },
      {
        status:
          500,
      }
    );
  }
}