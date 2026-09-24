import { NextResponse } from "next/server";

import {
  createClient as createServerClient,
} from "@/app/_utils/supabase/server";

import {
  createClient as createAdminClient,
} from "@supabase/supabase-js";


const adminSupabase =
  createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );


export async function POST() {

  try {

    // =====================================
    // 1. AUTHENTICATE
    // =====================================

    const authSupabase =
      await createServerClient();


    const {
      data: { user },
      error: authError,
    } =
      await authSupabase.auth.getUser();


    if (
      authError ||
      !user
    ) {

      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED",
        },
        {
          status: 401,
        }
      );
    }


    // =====================================
    // 2. LOAD SUBSCRIPTION
    // =====================================

    const {
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
          plus_current_period_end,
          provider_subscription_code,
          provider_subscription_token
        `)
        .eq("id", user.id)
        .single();


    if (
      profileError ||
      !profile
    ) {

      return NextResponse.json(
        {
          success: false,
          error: "PROFILE_NOT_FOUND",
        },
        {
          status: 404,
        }
      );
    }


    if (
      !profile.provider_subscription_code ||
      !profile.provider_subscription_token
    ) {

      return NextResponse.json(
        {
          success: false,

          error:
            "SUBSCRIPTION_NOT_FOUND",

          message:
            "No Paystack subscription was found.",
        },
        {
          status: 404,
        }
      );
    }


    // =====================================
    // 3. DISABLE FUTURE RENEWAL
    // =====================================

    const response =
      await fetch(
        "https://api.paystack.co/subscription/disable",
        {
          method: "POST",

          headers: {

            Authorization:
              `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({

              code:
                profile.provider_subscription_code,

              token:
                profile.provider_subscription_token,

            }),
        }
      );


    const paystackData =
      await response.json();


    console.log(
      "Paystack cancellation:",
      paystackData
    );


    if (
      !response.ok ||
      !paystackData?.status
    ) {

      return NextResponse.json(
        {
          success: false,

          error:
            "CANCELLATION_FAILED",

          message:
            paystackData?.message ||
            "Unable to cancel Grossary Plus.",
        },
        {
          status: 400,
        }
      );
    }


    // =====================================
    // 4. UPDATE GROSSARY
    // =====================================

    /*
     * IMPORTANT:
     *
     * Don't set is_plus=false here.
     *
     * Paystack cancellation makes the
     * subscription non-renewing.
     *
     * Existing access remains until the
     * trial/current paid period ends.
     */

    const {
      error: updateError,
    } =
      await adminSupabase
        .from("users_info")
        .update({

          plus_cancel_at_period_end:
            true,

          plus_cancelled_at:
            new Date()
              .toISOString(),

        })
        .eq(
          "id",
          user.id
        );


    if (updateError) {

      console.error(
        "Grossary cancellation update failed:",
        updateError
      );


      /*
       * Paystack has already cancelled
       * renewal at this point.
       */

      return NextResponse.json(
        {
          success: false,

          error:
            "CANCELLATION_SAVE_FAILED",

          message:
            "Your Paystack subscription was cancelled, but Grossary could not update your account.",
        },
        {
          status: 500,
        }
      );
    }


    // =====================================
    // 5. ACCESS END DATE
    // =====================================

    const accessEndsAt =
      profile.plus_status ===
        "trialing"
        ? profile.plus_trial_ends_at
        : profile.plus_current_period_end;


    return NextResponse.json({

      success: true,

      cancelled: true,

      cancelAtPeriodEnd: true,

      accessEndsAt,

      message:
        "Grossary Plus will not renew.",

    });


  } catch (error) {

    console.error(
      "Grossary Plus cancellation error:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        error: "CANCELLATION_ERROR",
      },
      {
        status: 500,
      }
    );
  }
}