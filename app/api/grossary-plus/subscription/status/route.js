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


export async function GET() {

  try {

    // =====================================
    // 1. AUTHENTICATE USER
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
    // 2. LOAD SUBSCRIPTION FROM GROSSARY
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
          plus_trial_used,
          plus_trial_started_at,
          plus_trial_ends_at,
          plus_current_period_start,
          plus_current_period_end,
          plus_cancel_at_period_end,
          plus_cancelled_at,
          subscription_provider,
          provider_subscription_code
        `)
        .eq("id", user.id)
        .single();


    if (
      profileError ||
      !profile
    ) {

      console.error(
        "Subscription profile error:",
        profileError
      );


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


    // =====================================
    // 3. FETCH PAYSTACK SUBSCRIPTION
    // =====================================

    let paystackSubscription =
      null;


    if (
      profile.subscription_provider === "paystack" &&
      profile.provider_subscription_code
    ) {

      try {

        const response =
          await fetch(
            `https://api.paystack.co/subscription/${encodeURIComponent(
              profile.provider_subscription_code
            )}`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
              },

              cache: "no-store",
            }
          );


        const data =
          await response.json();


        if (
          response.ok &&
          data?.status
        ) {

          paystackSubscription =
            data.data;

        } else {

          console.error(
            "Unable to fetch Paystack subscription:",
            data
          );

        }

      } catch (error) {

        /*
         * Paystack being temporarily
         * unavailable shouldn't make the
         * whole Grossary account page fail.
         */

        console.error(
          "Paystack subscription fetch error:",
          error
        );

      }
    }


    // =====================================
    // 4. CALCULATE TRIAL DAYS REMAINING
    // =====================================

    let trialDaysRemaining =
      null;


    if (
      profile.plus_status === "trialing" &&
      profile.plus_trial_ends_at
    ) {

      const now =
        new Date();


      const trialEnd =
        new Date(
          profile.plus_trial_ends_at
        );


      const millisecondsRemaining =
        trialEnd.getTime() -
        now.getTime();


      trialDaysRemaining =
        Math.max(
          0,
          Math.ceil(
            millisecondsRemaining /
            (1000 * 60 * 60 * 24)
          )
        );
    }


    // =====================================
    // 5. RESPONSE
    // =====================================

    return NextResponse.json({

      success: true,

      subscription: {

        isPlus:
          profile.is_plus,

        status:
          profile.plus_status,

        price:
          39,

        currency:
          "ZAR",

        interval:
          "monthly",

        trialUsed:
          profile.plus_trial_used,

        trialStartedAt:
          profile.plus_trial_started_at,

        trialEndsAt:
          profile.plus_trial_ends_at,

        trialDaysRemaining,

        currentPeriodStart:
          profile.plus_current_period_start,

        currentPeriodEnd:
          profile.plus_current_period_end,

        cancelAtPeriodEnd:
          profile.plus_cancel_at_period_end,

        cancelledAt:
          profile.plus_cancelled_at,

        provider:
          profile.subscription_provider,

        providerStatus:
          paystackSubscription?.status ||
          null,

        nextPaymentDate:
          paystackSubscription
            ?.next_payment_date ||
          null,

      },
    });


  } catch (error) {

    console.error(
      "Grossary Plus status error:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        error: "STATUS_ERROR",
      },
      {
        status: 500,
      }
    );
  }
}