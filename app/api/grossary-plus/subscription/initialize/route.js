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


// ========================================
// POST
// ========================================

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
          plus_trial_used,
          plus_trial_ends_at,
          plus_current_period_end,
          plus_cancel_at_period_end,
          provider_subscription_code
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

    /*
     * Don't allow someone who currently
     * has access to create another
     * subscription.
     */

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
            profile.plus_status ===
              "trialing"
              ? "Your Grossary Plus free trial is already active."
              : "You already have an active Grossary Plus subscription.",
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
    // 5. REQUEST BODY
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


    // =====================================
    // 6. APP URL
    // =====================================

    const appUrl =
      process.env
        .NEXT_PUBLIC_APP_URL;


    if (!appUrl) {

      throw new Error(
        "NEXT_PUBLIC_APP_URL is not configured."
      );
    }


    // =====================================
    // 7. CALLBACK URL
    // =====================================

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
    // 8. NEW SUBSCRIBER
    // =====================================

    /*
     * NEW USER:
     *
     * R1 card verification
     *      ↓
     * reusable authorization
     *      ↓
     * 7-day free trial
     *      ↓
     * R39 subscription starts after trial
     */

    if (
      trialEligible
    ) {

      console.log(
        "Starting Grossary Plus trial checkout:",
        {
          userId:
            user.id,

          email:
            user.email,
        }
      );


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

                // R1 verification

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
                    true,

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
        "Paystack trial initialize:",
        paystackData
      );


      if (
        !paystackResponse.ok ||
        !paystackData?.status
      ) {

        console.error(
          "Paystack trial initialization failed:",
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


      return NextResponse.json({

        success:
          true,

        flow:
          "trial",

        trialEligible:
          true,

        authorizationUrl:
          paystackData
            .data
            .authorization_url,

        reference:
          paystackData
            .data
            .reference,

      });
    }


    // =====================================
    // 9. RETURNING SUBSCRIBER
    // =====================================

    /*
     * This user has already used their
     * free trial.
     *
     * They must therefore pay R39 now.
     *
     * Paystack will create the recurring
     * subscription automatically because
     * we're attaching the plan to this
     * transaction.
     */

    const planCode =
      process.env
        .PAYSTACK_GROSSARY_PLUS_PLAN_CODE;


    if (!planCode) {

      console.error(
        "PAYSTACK_GROSSARY_PLUS_PLAN_CODE is missing."
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "PLAN_NOT_CONFIGURED",

          message:
            "Grossary Plus subscription plan is not configured.",
        },
        {
          status:
            500,
        }
      );
    }


    console.log(
      "Starting returning Grossary Plus subscription:",
      {
        userId:
          user.id,

        email:
          user.email,

        planCode,
      }
    );


    // =====================================
    // 10. INITIALIZE R39 SUBSCRIPTION
    // =====================================

    /*
     * IMPORTANT:
     *
     * Adding the Paystack plan means
     * Paystack charges the plan amount
     * and automatically creates the
     * recurring subscription after
     * successful payment.
     *
     * There is NO free trial here.
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

              /*
               * Paystack requires an amount
               * field, but when a plan is
               * supplied the plan amount
               * takes precedence.
               *
               * R39 = 3900 cents.
               */

              amount:
                3900,

              currency:
                "ZAR",

              plan:
                planCode,

              callback_url:
                callbackUrl
                  .toString(),

              metadata: {

                purpose:
                  "grossary_plus_subscription",

                grossary_user_id:
                  user.id,

                trial_eligible:
                  false,

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
      "Paystack subscription initialize:",
      paystackData
    );


    if (
      !paystackResponse.ok ||
      !paystackData?.status
    ) {

      console.error(
        "Paystack subscription initialization failed:",
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
            "Unable to start Grossary Plus checkout.",
        },
        {
          status:
            500,
        }
      );
    }


    // =====================================
    // 11. RETURN CHECKOUT URL
    // =====================================

    return NextResponse.json({

      success:
        true,

      flow:
        "subscription",

      trialEligible:
        false,

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