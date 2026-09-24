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
    // 2. GET REFERENCE
    // =====================================

    const body =
      await request.json();


    const reference =
      body?.reference;


    if (
      !reference ||
      typeof reference !==
        "string"
    ) {

      return NextResponse.json(
        {
          success:
            false,

          error:
            "REFERENCE_REQUIRED",

          message:
            "Paystack transaction reference is required.",
        },
        {
          status:
            400,
        }
      );
    }


    console.log(
      "Verifying Grossary Plus transaction:",
      reference
    );


    // =====================================
    // 3. LOAD USER
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
  plus_trial_started_at,
  plus_trial_ends_at,
  provider_customer_code,
  provider_authorization_code,
  provider_subscription_code,
  provider_subscription_token
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
    // 4. HANDLE ALREADY-ACTIVATED TRIAL
    // =====================================

    /*
     * This makes the endpoint safer if
     * the callback page gets refreshed
     * or verification is called twice.
     */

   if (
  profile.is_plus === true &&
  profile.plus_status === "trialing" &&
  profile.plus_trial_used === true &&
  profile.provider_subscription_code
) {

  return NextResponse.json({

    success:
      true,

    alreadyActivated:
      true,

    status:
      "trialing",

    subscriptionCreated:
      true,

    subscriptionCode:
      profile
        .provider_subscription_code,

    trialEndsAt:
      profile
        .plus_trial_ends_at,
  });
}

    // =====================================
    // 5. PREVENT SECOND FREE TRIAL
    // =====================================

    if (
      profile.plus_trial_used ===
      true
    ) {

      return NextResponse.json(
        {
          success:
            false,

          error:
            "TRIAL_ALREADY_USED",

          message:
            "This account has already used its Grossary Plus free trial.",
        },
        {
          status:
            409,
        }
      );
    }


    // =====================================
    // 6. VERIFY WITH PAYSTACK
    // =====================================

    const paystackResponse =
      await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(
          reference
        )}`,
        {
          method:
            "GET",

          headers: {
            Authorization:
              `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },

          cache:
            "no-store",
        }
      );


    const paystackData =
      await paystackResponse
        .json();


    console.log(
      "Paystack verification:",
      {
        status:
          paystackData
            ?.status,

        transactionStatus:
          paystackData
            ?.data
            ?.status,

        reference:
          paystackData
            ?.data
            ?.reference,

        amount:
          paystackData
            ?.data
            ?.amount,

        currency:
          paystackData
            ?.data
            ?.currency,

        channel:
          paystackData
            ?.data
            ?.channel,
      }
    );


    if (
      !paystackResponse.ok ||
      !paystackData?.status
    ) {

      return NextResponse.json(
        {
          success:
            false,

          error:
            "PAYSTACK_VERIFICATION_FAILED",

          message:
            paystackData
              ?.message ||
            "Unable to verify Paystack transaction.",
        },
        {
          status:
            400,
        }
      );
    }


    const transaction =
      paystackData.data;


    // =====================================
    // 7. VERIFY PAYMENT SUCCESS
    // =====================================

    if (
      transaction?.status !==
      "success"
    ) {

      return NextResponse.json(
        {
          success:
            false,

          error:
            "PAYMENT_NOT_SUCCESSFUL",

          message:
            "The card verification payment was not successful.",
        },
        {
          status:
            400,
        }
      );
    }


    // =====================================
    // 8. VERIFY REFERENCE
    // =====================================

    if (
      transaction.reference !==
      reference
    ) {

      console.error(
        "Reference mismatch:",
        {
          expected:
            reference,

          received:
            transaction.reference,
        }
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "REFERENCE_MISMATCH",
        },
        {
          status:
            400,
        }
      );
    }


    // =====================================
    // 9. VERIFY R1 AMOUNT
    // =====================================

    /*
     * Paystack amounts are in the
     * currency subunit.
     *
     * R1 = 100 cents.
     */

    if (
      Number(
        transaction.amount
      ) !==
      100
    ) {

      console.error(
        "Unexpected verification amount:",
        transaction.amount
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "INVALID_AMOUNT",

          message:
            "Unexpected card verification amount.",
        },
        {
          status:
            400,
        }
      );
    }


    // =====================================
    // 10. VERIFY CURRENCY
    // =====================================

    if (
      transaction.currency !==
      "ZAR"
    ) {

      return NextResponse.json(
        {
          success:
            false,

          error:
            "INVALID_CURRENCY",
        },
        {
          status:
            400,
        }
      );
    }


    // =====================================
    // 11. VERIFY CUSTOMER EMAIL
    // =====================================

    const customer =
      transaction.customer;


    const paystackEmail =
      customer
        ?.email
        ?.toLowerCase();


    const userEmail =
      user
        ?.email
        ?.toLowerCase();


    if (
      !paystackEmail ||
      !userEmail ||
      paystackEmail !==
        userEmail
    ) {

      console.error(
        "Paystack email mismatch:",
        {
          paystackEmail,
          userEmail,
        }
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "CUSTOMER_MISMATCH",

          message:
            "The Paystack transaction does not belong to this Grossary account.",
        },
        {
          status:
            403,
        }
      );
    }


    // =====================================
    // 12. VERIFY METADATA USER
    // =====================================

    /*
     * We put grossary_user_id into
     * metadata during initialization.
     *
     * This gives us another ownership
     * check beyond the email address.
     */

    const metadata =
      transaction
        ?.metadata;


    const metadataUserId =
      metadata
        ?.grossary_user_id;


    if (
      metadataUserId &&
      metadataUserId !==
        user.id
    ) {

      console.error(
        "Grossary user ID mismatch:",
        {
          metadataUserId,
          userId:
            user.id,
        }
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "USER_MISMATCH",
        },
        {
          status:
            403,
        }
      );
    }


    // =====================================
    // 13. GET AUTHORIZATION
    // =====================================

    const authorization =
      transaction
        ?.authorization;


    const authorizationCode =
      authorization
        ?.authorization_code;


    if (
      !authorizationCode
    ) {

      console.error(
        "Paystack did not return an authorization code."
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "AUTHORIZATION_NOT_AVAILABLE",

          message:
            "A reusable payment authorization was not returned.",
        },
        {
          status:
            400,
        }
      );
    }


    // =====================================
    // 14. CHECK REUSABLE AUTHORIZATION
    // =====================================

    if (
      authorization
        ?.reusable !==
      true
    ) {

      console.error(
        "Authorization is not reusable:",
        authorization
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "AUTHORIZATION_NOT_REUSABLE",

          message:
            "This payment method cannot be used for the Grossary Plus subscription.",
        },
        {
          status:
            400,
        }
      );
    }


    // =====================================
    // 15. CUSTOMER CODE
    // =====================================

    const customerCode =
      customer
        ?.customer_code;


    if (
      !customerCode
    ) {

      return NextResponse.json(
        {
          success:
            false,

          error:
            "CUSTOMER_CODE_NOT_FOUND",
        },
        {
          status:
            400,
        }
      );
    }


    // =====================================
    // 16. CALCULATE TRIAL
    // =====================================

    const trialStartedAt =
      new Date();


    const trialEndsAt =
      new Date(
        trialStartedAt
      );


    trialEndsAt.setDate(
      trialEndsAt.getDate() +
      7
    );


    console.log(
      "Grossary Plus trial:",
      {
        startedAt:
          trialStartedAt
            .toISOString(),

        endsAt:
          trialEndsAt
            .toISOString(),
      }
    );


    // =====================================
    // 17. UPDATE USER
    // =====================================

    const {
      error:
        updateError,
    } =
      await adminSupabase
        .from(
          "users_info"
        )
        .update({

          is_plus:
            true,

          plus_status:
            "trialing",

          plus_trial_used:
            true,

          plus_trial_started_at:
            trialStartedAt
              .toISOString(),

          plus_trial_ends_at:
            trialEndsAt
              .toISOString(),

          subscription_provider:
            "paystack",

          provider_customer_code:
            customerCode,

          provider_authorization_code:
            authorizationCode,

        })
        .eq(
          "id",
          user.id
        );


    if (
      updateError
    ) {

      console.error(
        "Failed to activate Grossary Plus trial:",
        updateError
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "TRIAL_ACTIVATION_FAILED",

          message:
            "Payment was verified but Grossary Plus could not be activated.",
        },
        {
          status:
            500,
        }
      );
    }


    console.log(
      "Grossary Plus trial activated:",
      user.id
    );

// =====================================
// 18. CREATE PAYSTACK SUBSCRIPTION
// =====================================

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
  "Creating Paystack subscription:",
  {
    customerCode,
    planCode,
    startDate:
      trialEndsAt
        .toISOString(),
  }
);


const subscriptionResponse =
  await fetch(
    "https://api.paystack.co/subscription",
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

          customer:
            customerCode,

          plan:
            planCode,

          authorization:
            authorizationCode,

          start_date:
            trialEndsAt
              .toISOString(),
        }),
    }
  );


const subscriptionData =
  await subscriptionResponse
    .json();


console.log(
  "Paystack subscription response:",
  subscriptionData
);


if (
  !subscriptionResponse.ok ||
  !subscriptionData?.status
) {

  console.error(
    "Failed to create Paystack subscription:",
    subscriptionData
  );


  /*
   * IMPORTANT:
   *
   * Do not remove the user's trial.
   *
   * Their R1 verification succeeded
   * and their 7-day trial is valid.
   *
   * We simply haven't managed to
   * schedule recurring billing yet.
   */

  return NextResponse.json(
    {
      success:
        false,

      error:
        "SUBSCRIPTION_CREATION_FAILED",

      message:
        subscriptionData
          ?.message ||
        "Your trial was activated, but recurring billing could not be scheduled.",

      trialActive:
        true,

      trialEndsAt:
        trialEndsAt
          .toISOString(),
    },
    {
      status:
        500,
    }
  );
}


// =====================================
// 19. EXTRACT SUBSCRIPTION DETAILS
// =====================================

const subscription =
  subscriptionData.data;


const subscriptionCode =
  subscription
    ?.subscription_code;


const subscriptionToken =
  subscription
    ?.email_token;


const nextPaymentDate =
  subscription
    ?.next_payment_date;


if (!subscriptionCode) {

  console.error(
    "Paystack subscription code missing:",
    subscriptionData
  );


  return NextResponse.json(
    {
      success:
        false,

      error:
        "SUBSCRIPTION_CODE_MISSING",

      trialActive:
        true,
    },
    {
      status:
        500,
    }
  );
}


console.log(
  "Grossary Plus subscription created:",
  {
    subscriptionCode,
    nextPaymentDate,
  }
);


// =====================================
// 20. SAVE SUBSCRIPTION
// =====================================

const {
  error:
    subscriptionUpdateError,
} =
  await adminSupabase
    .from(
      "users_info"
    )
    .update({

      provider_subscription_code:
        subscriptionCode,

      provider_subscription_token:
        subscriptionToken || null,

    })
    .eq(
      "id",
      user.id
    );


if (
  subscriptionUpdateError
) {

  console.error(
    "Failed to save Paystack subscription:",
    subscriptionUpdateError
  );


  /*
   * The subscription DOES exist in
   * Paystack at this point.
   *
   * Don't try creating another one
   * automatically because that could
   * create duplicate subscriptions.
   */

  return NextResponse.json(
    {
      success:
        false,

      error:
        "SUBSCRIPTION_SAVE_FAILED",

      message:
        "The Paystack subscription was created but could not be saved to Grossary.",

      trialActive:
        true,
    },
    {
      status:
        500,
    }
  );
}
    // =====================================
    // 21. REFUND R1
    // =====================================

    /*
     * The trial is already active at
     * this point.
     *
     * A refund failure should therefore
     * NOT undo the user's trial.
     */

    let refundQueued =
      false;


    try {

      const refundResponse =
        await fetch(
          "https://api.paystack.co/refund",
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

                transaction:
                  transaction.id,

                amount:
                  100,

                currency:
                  "ZAR",

                customer_note:
                  "Grossary Plus card verification refund",

                merchant_note:
                  "Refund of R1 Grossary Plus card verification transaction",
              }),
          }
        );


      const refundData =
        await refundResponse
          .json();


      console.log(
        "Paystack verification refund:",
        refundData
      );


      if (
        refundResponse.ok &&
        refundData?.status
      ) {

        refundQueued =
          true;

      }

    } catch (
      refundError
    ) {

      console.error(
        "R1 refund failed:",
        refundError
      );

    }


    // =====================================
    // 19. SUCCESS
    // =====================================

   return NextResponse.json({

  success:
    true,

  status:
    "trialing",

  isPlus:
    true,

  subscriptionCreated:
    true,

  subscriptionCode,

  nextPaymentDate:
    nextPaymentDate || null,

  trialStartedAt:
    trialStartedAt
      .toISOString(),

  trialEndsAt:
    trialEndsAt
      .toISOString(),

  refundQueued,

});

  } catch (error) {

    console.error(
      "Grossary Plus verification error:",
      error
    );


    return NextResponse.json(
      {
        success:
          false,

        error:
          "VERIFICATION_ERROR",

        message:
          error?.message ||
          "Unable to verify Grossary Plus subscription.",
      },
      {
        status:
          500,
      }
    );
  }
}