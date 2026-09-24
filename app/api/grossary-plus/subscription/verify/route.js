import {
  NextResponse,
} from "next/server";

import {
  createClient as createServerClient,
} from "@/app/_utils/supabase/server";

import {
  createClient as createAdminClient,
} from "@supabase/supabase-js";


// ========================================
// SUPABASE ADMIN
// ========================================

const adminSupabase =
  createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );


// ========================================
// CONSTANTS
// ========================================

const TRIAL_PURPOSE =
  "grossary_plus_card_verification";

const SUBSCRIPTION_PURPOSE =
  "grossary_plus_subscription";

const VERIFICATION_AMOUNT =
  100;

const SUBSCRIPTION_AMOUNT =
  3900;


// ========================================
// REFUND R1 VERIFICATION PAYMENT
// ========================================

async function refundVerificationPayment(
  transactionId
) {

  if (!transactionId) {
    return false;
  }


  try {

    const response =
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
                transactionId,

              amount:
                VERIFICATION_AMOUNT,

              currency:
                "ZAR",

              customer_note:
                "Grossary Plus card verification refund",

              merchant_note:
                "Refund of R1 Grossary Plus card verification transaction",
            }),
        }
      );


    const data =
      await response.json();


    console.log(
      "Paystack verification refund:",
      data
    );


    return (
      response.ok &&
      data?.status === true
    );


  } catch (error) {

    console.error(
      "R1 refund failed:",
      error
    );


    return false;
  }
}


// ========================================
// GET PAYSTACK CUSTOMER
// ========================================

async function getPaystackCustomer(
  customerCode
) {

  const response =
    await fetch(
      `https://api.paystack.co/customer/${encodeURIComponent(
        customerCode
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


  const data =
    await response.json();


  return {
    response,
    data,
  };
}


// ========================================
// GET FULL PAYSTACK SUBSCRIPTION
// ========================================

async function getPaystackSubscription(
  subscriptionCode
) {

  if (!subscriptionCode) {

    return {
      response:
        null,

      data:
        null,
    };
  }


  console.log(
    "Getting full Paystack subscription:",
    subscriptionCode
  );


  const response =
    await fetch(
      `https://api.paystack.co/subscription/${encodeURIComponent(
        subscriptionCode
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


  const data =
    await response.json();


  console.log(
    "Full Paystack subscription response:",
    {
      requestSuccessful:
        data?.status,

      subscriptionCode:
        data?.data
          ?.subscription_code,

      status:
        data?.data
          ?.status,

      planCode:
        data?.data
          ?.plan
          ?.plan_code ||
        data?.data
          ?.plan_code ||
        null,

      nextPaymentDate:
        data?.data
          ?.next_payment_date,

      hasEmailToken:
        Boolean(
          data?.data
            ?.email_token
        ),
    }
  );


  return {
    response,
    data,
  };
}


// ========================================
// RECOVER EXISTING GROSSARY+ SUBSCRIPTION
// ========================================

async function recoverExistingSubscription({
  customerCode,
  planCode,
}) {

  console.log(
    "Recovering Paystack subscription:",
    {
      customerCode,
      planCode,
    }
  );


  // ======================================
  // 1. GET CUSTOMER
  // ======================================

  const {
    response,
    data,
  } =
    await getPaystackCustomer(
      customerCode
    );


  if (
    !response.ok ||
    !data?.status
  ) {

    console.error(
      "Unable to retrieve Paystack customer:",
      data
    );


    return {
      success:
        false,

      error:
        "CUSTOMER_RECOVERY_FAILED",
    };
  }


  // ======================================
  // 2. GET CUSTOMER SUBSCRIPTIONS
  // ======================================

  const subscriptions =
    Array.isArray(
      data?.data?.subscriptions
    )
      ? data.data.subscriptions
      : [];


  console.log(
    "Paystack customer subscriptions:",
    subscriptions.map(
      (subscription) => ({
        subscriptionCode:
          subscription
            ?.subscription_code,

        status:
          subscription
            ?.status,

        nextPaymentDate:
          subscription
            ?.next_payment_date,
      })
    )
  );


  if (
    subscriptions.length ===
    0
  ) {

    console.error(
      "Paystack customer has no subscriptions."
    );


    return {
      success:
        false,

      error:
        "SUBSCRIPTION_NOT_FOUND",
    };
  }


  // ======================================
  // 3. FETCH FULL SUBSCRIPTIONS
  // ======================================

  /*
   * The customer endpoint may return
   * abbreviated subscription objects.
   *
   * In our test it returned:
   *
   * subscription_code
   * status
   * next_payment_date
   *
   * but NOT the plan code.
   *
   * Therefore we use each SUB_... code
   * to fetch the complete subscription.
   */

  const fullSubscriptions =
    [];


  for (
    const customerSubscription
    of subscriptions
  ) {

    const subscriptionCode =
      customerSubscription
        ?.subscription_code;


    if (!subscriptionCode) {
      continue;
    }


    const {
      response:
        subscriptionResponse,

      data:
        subscriptionData,
    } =
      await getPaystackSubscription(
        subscriptionCode
      );


    if (
      !subscriptionResponse ||
      !subscriptionResponse.ok ||
      !subscriptionData?.status ||
      !subscriptionData?.data
    ) {

      console.error(
        "Unable to retrieve full Paystack subscription:",
        {
          subscriptionCode,
          subscriptionData,
        }
      );


      continue;
    }


    fullSubscriptions.push(
      subscriptionData.data
    );
  }


  // ======================================
  // 4. NO FULL SUBSCRIPTIONS
  // ======================================

  if (
    fullSubscriptions.length ===
    0
  ) {

    console.error(
      "No full Paystack subscriptions could be retrieved."
    );


    return {
      success:
        false,

      error:
        "SUBSCRIPTION_DETAILS_NOT_FOUND",
    };
  }


  // ======================================
  // 5. LOG FULL SUBSCRIPTIONS
  // ======================================

  console.log(
    "Full Paystack subscriptions:",
    fullSubscriptions.map(
      (subscription) => ({
        subscriptionCode:
          subscription
            ?.subscription_code,

        planCode:
          subscription
            ?.plan
            ?.plan_code ||
          subscription
            ?.plan_code ||
          null,

        status:
          subscription
            ?.status,

        nextPaymentDate:
          subscription
            ?.next_payment_date,

        hasEmailToken:
          Boolean(
            subscription
              ?.email_token
          ),
      })
    )
  );


  // ======================================
  // 6. MATCH GROSSARY+ PLAN
  // ======================================

  const matchingSubscriptions =
    fullSubscriptions.filter(
      (subscription) => {

        const subscriptionPlanCode =
          subscription
            ?.plan
            ?.plan_code ||
          subscription
            ?.plan_code ||
          null;


        return (
          subscriptionPlanCode ===
          planCode
        );
      }
    );


  if (
    matchingSubscriptions.length ===
    0
  ) {

    console.error(
      "No Paystack subscription matched the Grossary+ plan:",
      {
        expectedPlanCode:
          planCode,

        subscriptions:
          fullSubscriptions.map(
            (subscription) => ({
              subscriptionCode:
                subscription
                  ?.subscription_code,

              planCode:
                subscription
                  ?.plan
                  ?.plan_code ||
                subscription
                  ?.plan_code ||
                null,

              status:
                subscription
                  ?.status,
            })
          ),
      }
    );


    return {
      success:
        false,

      error:
        "SUBSCRIPTION_NOT_FOUND",
    };
  }


  // ======================================
  // 7. PREFER ACTIVE SUBSCRIPTION
  // ======================================

  const preferredStatuses =
    [
      "active",
      "non-renewing",
      "attention",
    ];


  let subscription =
    matchingSubscriptions.find(
      (item) =>
        preferredStatuses.includes(
          item?.status
        )
    );


  if (!subscription) {

    subscription =
      matchingSubscriptions[0];

  }


  console.log(
    "Grossary+ Paystack subscription recovered:",
    {
      subscriptionCode:
        subscription
          ?.subscription_code,

      planCode:
        subscription
          ?.plan
          ?.plan_code ||
        subscription
          ?.plan_code ||
        null,

      status:
        subscription
          ?.status,

      nextPaymentDate:
        subscription
          ?.next_payment_date,

      hasEmailToken:
        Boolean(
          subscription
            ?.email_token
        ),
    }
  );


  return {
    success:
      true,

    subscription,
  };
}


// ========================================
// SAVE SUBSCRIPTION DETAILS
// ========================================

async function saveSubscriptionDetails({
  userId,
  subscription,
}) {

  const subscriptionCode =
    subscription
      ?.subscription_code;


  const subscriptionToken =
    subscription
      ?.email_token;


  const nextPaymentDate =
    subscription
      ?.next_payment_date ||
    null;


  if (!subscriptionCode) {

    console.error(
      "Paystack subscription code missing:",
      subscription
    );


    return {
      success:
        false,

      error:
        "SUBSCRIPTION_CODE_MISSING",
    };
  }


  if (!subscriptionToken) {

    console.error(
      "Paystack subscription token missing:",
      {
        subscriptionCode,
        subscription,
      }
    );


    return {
      success:
        false,

      error:
        "SUBSCRIPTION_TOKEN_MISSING",
    };
  }


  const {
    error,
  } =
    await adminSupabase
      .from(
        "users_info"
      )
      .update({
        provider_subscription_code:
          subscriptionCode,

        provider_subscription_token:
          subscriptionToken,
      })
      .eq(
        "id",
        userId
      );


  if (error) {

    console.error(
      "Failed to save Paystack subscription:",
      error
    );


    return {
      success:
        false,

      error:
        "SUBSCRIPTION_SAVE_FAILED",
    };
  }


  return {
    success:
      true,

    subscriptionCode,

    subscriptionToken,

    nextPaymentDate,
  };
}


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
          plus_current_period_start,
          plus_current_period_end,
          plus_cancel_at_period_end,
          plus_cancelled_at,
          subscription_provider,
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
    // 4. VERIFY TRANSACTION WITH PAYSTACK
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
      await paystackResponse.json();


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


    console.log(
      "Paystack verification:",
      {
        status:
          paystackData?.status,

        transactionStatus:
          transaction?.status,

        reference:
          transaction?.reference,

        amount:
          transaction?.amount,

        currency:
          transaction?.currency,

        purpose:
          transaction
            ?.metadata
            ?.purpose,
      }
    );


    // =====================================
    // 5. VERIFY PAYMENT SUCCESS
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
            "The Paystack payment was not successful.",
        },
        {
          status:
            400,
        }
      );
    }


    // =====================================
    // 6. VERIFY REFERENCE
    // =====================================

    if (
      transaction.reference !==
        reference
    ) {

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
    // 7. VERIFY CURRENCY
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
    // 8. VERIFY CUSTOMER
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
    // 9. VERIFY METADATA
    // =====================================

    const metadata =
      transaction
        ?.metadata;


    const metadataUserId =
      metadata
        ?.grossary_user_id;


    if (
      !metadataUserId ||
      metadataUserId !==
        user.id
    ) {

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
    // 10. DETERMINE FLOW
    // =====================================

    const purpose =
      metadata
        ?.purpose;


    if (
      purpose !==
        TRIAL_PURPOSE &&
      purpose !==
        SUBSCRIPTION_PURPOSE
    ) {

      console.error(
        "Unexpected Grossary Plus transaction purpose:",
        purpose
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "INVALID_TRANSACTION_PURPOSE",
        },
        {
          status:
            400,
        }
      );
    }


    const isTrialFlow =
      purpose ===
      TRIAL_PURPOSE;


    const isSubscriptionFlow =
      purpose ===
      SUBSCRIPTION_PURPOSE;


    // =====================================
    // 11. VERIFY AMOUNT
    // =====================================

    const expectedAmount =
      isTrialFlow
        ? VERIFICATION_AMOUNT
        : SUBSCRIPTION_AMOUNT;


    if (
      Number(
        transaction.amount
      ) !==
      expectedAmount
    ) {

      console.error(
        "Unexpected Grossary Plus amount:",
        {
          purpose,
          expectedAmount,

          receivedAmount:
            transaction.amount,
        }
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "INVALID_AMOUNT",

          message:
            "Unexpected Grossary Plus payment amount.",
        },
        {
          status:
            400,
        }
      );
    }


    // =====================================
    // 12. AUTHORIZATION
    // =====================================

    const authorization =
      transaction
        ?.authorization;


    const authorizationCode =
      authorization
        ?.authorization_code;


    if (!authorizationCode) {

      return NextResponse.json(
        {
          success:
            false,

          error:
            "AUTHORIZATION_NOT_AVAILABLE",
        },
        {
          status:
            400,
        }
      );
    }


    if (
      authorization
        ?.reusable !==
      true
    ) {

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
    // 13. CUSTOMER CODE
    // =====================================

    const customerCode =
      customer
        ?.customer_code;


    if (!customerCode) {

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
    // 14. PLAN CODE
    // =====================================

    const planCode =
      process.env
        .PAYSTACK_GROSSARY_PLUS_PLAN_CODE;


    if (!planCode) {

      return NextResponse.json(
        {
          success:
            false,

          error:
            "PLAN_NOT_CONFIGURED",
        },
        {
          status:
            500,
        }
      );
    }


    // =====================================
    // 15. SAVE CUSTOMER DETAILS
    // =====================================

    const {
      error:
        paymentDetailsError,
    } =
      await adminSupabase
        .from(
          "users_info"
        )
        .update({
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


    if (paymentDetailsError) {

      console.error(
        "Failed to save Paystack customer:",
        paymentDetailsError
      );


      return NextResponse.json(
        {
          success:
            false,

          error:
            "PAYMENT_DETAILS_SAVE_FAILED",
        },
        {
          status:
            500,
        }
      );
    }


    // =====================================
    // =====================================
    // TRIAL FLOW
    // =====================================
    // =====================================

    if (isTrialFlow) {

      // ===================================
      // 16A. IDEMPOTENT SUCCESS
      // ===================================

      if (
        profile.is_plus ===
          true &&
        profile.plus_status ===
          "trialing" &&
        profile.plus_trial_used ===
          true &&
        profile.provider_subscription_code &&
        profile.provider_subscription_token
      ) {

        return NextResponse.json({
          success:
            true,

          alreadyActivated:
            true,

          flow:
            "trial",

          status:
            "trialing",

          isPlus:
            true,

          subscriptionCreated:
            true,

          subscriptionCode:
            profile
              .provider_subscription_code,

          trialStartedAt:
            profile
              .plus_trial_started_at,

          trialEndsAt:
            profile
              .plus_trial_ends_at,
        });
      }


      // ===================================
      // 17A. RECOVERY STATE
      // ===================================

      const recoveringTrial =
        profile.is_plus ===
          true &&
        profile.plus_status ===
          "trialing" &&
        profile.plus_trial_used ===
          true;


      if (
        profile.plus_trial_used ===
          true &&
        !recoveringTrial
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


      // ===================================
      // 18A. TRIAL DATES
      // ===================================

      let trialStartedAt;
      let trialEndsAt;


      if (
        recoveringTrial &&
        profile.plus_trial_started_at &&
        profile.plus_trial_ends_at
      ) {

        trialStartedAt =
          new Date(
            profile.plus_trial_started_at
          );


        trialEndsAt =
          new Date(
            profile.plus_trial_ends_at
          );

      } else {

        trialStartedAt =
          new Date();


        trialEndsAt =
          new Date(
            trialStartedAt
          );


        trialEndsAt.setDate(
          trialEndsAt.getDate() +
          7
        );


        const {
          error:
            trialError,
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

              plus_cancel_at_period_end:
                false,
            })
            .eq(
              "id",
              user.id
            );


        if (trialError) {

          console.error(
            "Trial activation failed:",
            trialError
          );


          return NextResponse.json(
            {
              success:
                false,

              error:
                "TRIAL_ACTIVATION_FAILED",
            },
            {
              status:
                500,
            }
          );
        }
      }


      console.log(
        "Grossary Plus trial:",
        {
          recoveringTrial,

          startedAt:
            trialStartedAt
              .toISOString(),

          endsAt:
            trialEndsAt
              .toISOString(),
        }
      );


      // ===================================
      // 19A. CREATE SUBSCRIPTION
      // ===================================

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
        await subscriptionResponse.json();


      console.log(
        "Paystack trial subscription response:",
        subscriptionData
      );


      let subscription =
        null;


      let subscriptionRecovered =
        false;


      if (
        subscriptionResponse.ok &&
        subscriptionData?.status ===
          true
      ) {

        subscription =
          subscriptionData.data;

      } else if (
        subscriptionData?.code ===
          "duplicate_subscription"
      ) {

        const recovery =
          await recoverExistingSubscription({
            customerCode,
            planCode,
          });


        if (
          !recovery.success ||
          !recovery.subscription
        ) {

          return NextResponse.json(
            {
              success:
                false,

              error:
                "SUBSCRIPTION_RECOVERY_FAILED",

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


        subscription =
          recovery.subscription;

        subscriptionRecovered =
          true;

      } else {

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


      // ===================================
      // 20A. SAVE SUBSCRIPTION
      // ===================================

      const savedSubscription =
        await saveSubscriptionDetails({
          userId:
            user.id,

          subscription,
        });


      if (!savedSubscription.success) {

        return NextResponse.json(
          {
            success:
              false,

            error:
              savedSubscription.error,

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


      // ===================================
      // 21A. REFUND R1
      // ===================================

      let refundQueued =
        false;


      if (!recoveringTrial) {

        refundQueued =
          await refundVerificationPayment(
            transaction.id
          );

      } else {

        console.log(
          "Skipping R1 refund during trial recovery."
        );

      }


      // ===================================
      // 22A. TRIAL SUCCESS
      // ===================================

      return NextResponse.json({
        success:
          true,

        flow:
          "trial",

        status:
          "trialing",

        isPlus:
          true,

        subscriptionCreated:
          true,

        subscriptionRecovered,

        subscriptionCode:
          savedSubscription
            .subscriptionCode,

        nextPaymentDate:
          savedSubscription
            .nextPaymentDate,

        trialStartedAt:
          trialStartedAt
            .toISOString(),

        trialEndsAt:
          trialEndsAt
            .toISOString(),

        refundQueued,
      });
    }


    // =====================================
    // =====================================
    // RETURNING SUBSCRIBER
    // =====================================
    // =====================================

    if (isSubscriptionFlow) {

      // ===================================
      // 16B. MUST HAVE USED TRIAL
      // ===================================

      if (
        profile.plus_trial_used !==
        true
      ) {

        return NextResponse.json(
          {
            success:
              false,

            error:
              "INVALID_SUBSCRIPTION_FLOW",

            message:
              "This account is eligible for the Grossary Plus free trial.",
          },
          {
            status:
              400,
          }
        );
      }


      // ===================================
      // 17B. IDEMPOTENT SUCCESS
      // ===================================

      if (
        profile.is_plus ===
          true &&
        profile.plus_status ===
          "active" &&
        profile.provider_subscription_code &&
        profile.provider_subscription_token
      ) {

        return NextResponse.json({
          success:
            true,

          alreadyActivated:
            true,

          flow:
            "subscription",

          status:
            "active",

          isPlus:
            true,

          subscriptionCreated:
            true,

          subscriptionCode:
            profile
              .provider_subscription_code,

          currentPeriodStart:
            profile
              .plus_current_period_start,

          currentPeriodEnd:
            profile
              .plus_current_period_end,
        });
      }


      // ===================================
      // 18B. RECOVER FULL SUBSCRIPTION
      // ===================================

      /*
       * The R39 checkout already included
       * the Grossary+ Paystack plan.
       *
       * Therefore Paystack creates the
       * recurring subscription.
       *
       * We now retrieve the full SUB_...
       * object so we get:
       *
       * - plan code
       * - status
       * - next payment date
       * - email token
       */

      let recovery =
        await recoverExistingSubscription({
          customerCode,
          planCode,
        });


      // ===================================
      // RETRY ONCE
      // ===================================

      if (
        !recovery.success ||
        !recovery.subscription
      ) {

        console.log(
          "Subscription not ready. Retrying..."
        );


        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1200
            )
        );


        recovery =
          await recoverExistingSubscription({
            customerCode,
            planCode,
          });

      }


      if (
        !recovery.success ||
        !recovery.subscription
      ) {

        console.error(
          "Paid subscription could not be recovered:",
          recovery
        );


        return NextResponse.json(
          {
            success:
              false,

            error:
              "SUBSCRIPTION_RECOVERY_FAILED",

            message:
              "Your R39 payment succeeded, but Grossary is still waiting for Paystack to confirm the subscription. Please refresh shortly.",
          },
          {
            status:
              503,
          }
        );
      }


      const subscription =
        recovery.subscription;


      // ===================================
      // 19B. SAVE SUBSCRIPTION
      // ===================================

      const savedSubscription =
        await saveSubscriptionDetails({
          userId:
            user.id,

          subscription,
        });


      if (!savedSubscription.success) {

        return NextResponse.json(
          {
            success:
              false,

            error:
              savedSubscription.error,

            message:
              "Your payment succeeded, but Grossary could not save the Paystack subscription.",
          },
          {
            status:
              500,
          }
        );
      }


      // ===================================
      // 20B. DETERMINE PAID PERIOD
      // ===================================

      const periodStart =
        new Date();


      let periodEnd =
        null;


      if (
        savedSubscription
          .nextPaymentDate
      ) {

        const parsedDate =
          new Date(
            savedSubscription
              .nextPaymentDate
          );


        if (
          !Number.isNaN(
            parsedDate.getTime()
          )
        ) {

          periodEnd =
            parsedDate;

        }

      }


      // ===================================
      // FALLBACK: +1 MONTH
      // ===================================

      if (!periodEnd) {

        periodEnd =
          new Date(
            periodStart
          );


        periodEnd.setMonth(
          periodEnd.getMonth() +
          1
        );

      }


      // ===================================
      // 21B. ACTIVATE PAID PLUS
      // ===================================

      const {
        error:
          activationError,
      } =
        await adminSupabase
          .from(
            "users_info"
          )
          .update({
            is_plus:
              true,

            plus_status:
              "active",

            plus_current_period_start:
              periodStart
                .toISOString(),

            plus_current_period_end:
              periodEnd
                .toISOString(),

            plus_cancel_at_period_end:
              false,

            plus_cancelled_at:
              null,

            subscription_provider:
              "paystack",

            provider_customer_code:
              customerCode,

            provider_authorization_code:
              authorizationCode,

            provider_subscription_code:
              savedSubscription
                .subscriptionCode,

            provider_subscription_token:
              savedSubscription
                .subscriptionToken,
          })
          .eq(
            "id",
            user.id
          );


      if (activationError) {

        console.error(
          "Paid Grossary Plus activation failed:",
          activationError
        );


        return NextResponse.json(
          {
            success:
              false,

            error:
              "SUBSCRIPTION_ACTIVATION_FAILED",

            message:
              "Your R39 payment succeeded, but Grossary Plus could not be activated.",
          },
          {
            status:
              500,
          }
        );
      }


      console.log(
        "Grossary Plus paid subscription activated:",
        {
          userId:
            user.id,

          subscriptionCode:
            savedSubscription
              .subscriptionCode,

          nextPaymentDate:
            savedSubscription
              .nextPaymentDate,

          periodStart:
            periodStart
              .toISOString(),

          periodEnd:
            periodEnd
              .toISOString(),
        }
      );


      // ===================================
      // 22B. SUCCESS
      // ===================================

      return NextResponse.json({
        success:
          true,

        flow:
          "subscription",

        status:
          "active",

        isPlus:
          true,

        subscriptionCreated:
          true,

        subscriptionCode:
          savedSubscription
            .subscriptionCode,

        nextPaymentDate:
          savedSubscription
            .nextPaymentDate,

        currentPeriodStart:
          periodStart
            .toISOString(),

        currentPeriodEnd:
          periodEnd
            .toISOString(),

        refundQueued:
          false,
      });
    }


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