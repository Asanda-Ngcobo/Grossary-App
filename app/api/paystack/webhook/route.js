import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import crypto from "crypto";


// ========================================
// SUPABASE ADMIN
// ========================================

const adminSupabase =
  createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );


// ========================================
// VERIFY PAYSTACK SIGNATURE
// ========================================

function verifyPaystackSignature(
  rawBody,
  signature
) {

  if (
    !signature ||
    !process.env.PAYSTACK_SECRET_KEY
  ) {
    return false;
  }


  const hash =
    crypto
      .createHmac(
        "sha512",
        process.env.PAYSTACK_SECRET_KEY
      )
      .update(rawBody)
      .digest("hex");


  return hash === signature;
}


// ========================================
// FIND SUBSCRIPTION CODE
// ========================================

function getSubscriptionCode(data) {

  return (
    data?.subscription_code ||
    data?.subscription?.subscription_code ||
    null
  );
}


// ========================================
// FIND CUSTOMER CODE
// ========================================

function getCustomerCode(data) {

  return (
    data?.customer?.customer_code ||
    data?.customer_code ||
    null
  );
}


// ========================================
// FIND USER
// ========================================

async function findGrossaryUser(data) {

  const subscriptionCode =
    getSubscriptionCode(data);


  const customerCode =
    getCustomerCode(data);


  // --------------------------------------
  // Prefer subscription code
  // --------------------------------------

  if (subscriptionCode) {

    const {
      data: profile,
      error,
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
          provider_customer_code,
          provider_subscription_code
        `)
        .eq(
          "provider_subscription_code",
          subscriptionCode
        )
        .maybeSingle();


    if (error) {

      console.error(
        "Subscription user lookup error:",
        error
      );

    }


    if (profile) {
      return profile;
    }
  }


  // --------------------------------------
  // Fallback to Paystack customer
  // --------------------------------------

  if (customerCode) {

    const {
      data: profile,
      error,
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
          provider_customer_code,
          provider_subscription_code
        `)
        .eq(
          "provider_customer_code",
          customerCode
        )
        .maybeSingle();


    if (error) {

      console.error(
        "Customer user lookup error:",
        error
      );

    }


    if (profile) {
      return profile;
    }
  }


  return null;
}


// ========================================
// POST
// ========================================

export async function POST(request) {

  try {

    // =====================================
    // 1. READ RAW BODY
    // =====================================

    /*
     * IMPORTANT:
     *
     * Signature verification must use
     * the original raw request body.
     */

    const rawBody =
      await request.text();


    const signature =
      request.headers.get(
        "x-paystack-signature"
      );


    // =====================================
    // 2. VERIFY PAYSTACK
    // =====================================

    const validSignature =
      verifyPaystackSignature(
        rawBody,
        signature
      );


    if (!validSignature) {

      console.error(
        "Invalid Paystack webhook signature."
      );


      return NextResponse.json(
        {
          success: false,
          error: "INVALID_SIGNATURE",
        },
        {
          status: 401,
        }
      );
    }


    // =====================================
    // 3. PARSE EVENT
    // =====================================

    let event;


    try {

      event =
        JSON.parse(rawBody);

    } catch (error) {

      console.error(
        "Invalid Paystack webhook JSON:",
        error
      );


      return NextResponse.json(
        {
          success: false,
          error: "INVALID_JSON",
        },
        {
          status: 400,
        }
      );
    }


    const eventType =
      event?.event;


    const data =
      event?.data;


    console.log(
      "Paystack webhook:",
      eventType
    );


    if (
      !eventType ||
      !data
    ) {

      return NextResponse.json(
        {
          received: true,
        }
      );
    }


    // =====================================
    // 4. FIND GROSSARY USER
    // =====================================

    const profile =
      await findGrossaryUser(
        data
      );


    /*
     * Some Paystack events may have
     * nothing to do with Grossary Plus.
     *
     * Always acknowledge them.
     */

    if (!profile) {

      console.log(
        "No Grossary Plus user found for:",
        {
          eventType,
          subscriptionCode:
            getSubscriptionCode(data),
          customerCode:
            getCustomerCode(data),
        }
      );


      return NextResponse.json({
        received: true,
      });
    }


    console.log(
      "Grossary Plus webhook user:",
      profile.id
    );


    // =====================================
    // 5. SUBSCRIPTION CREATED
    // =====================================

    if (
      eventType ===
      "subscription.create"
    ) {

      const subscriptionCode =
        getSubscriptionCode(data);


      const emailToken =
        data?.email_token ||
        data?.subscription?.email_token ||
        null;


      const update = {
        subscription_provider:
          "paystack",
      };


      if (subscriptionCode) {

        update.provider_subscription_code =
          subscriptionCode;

      }


      if (emailToken) {

        update.provider_subscription_token =
          emailToken;

      }


      const {
        error,
      } =
        await adminSupabase
          .from("users_info")
          .update(update)
          .eq(
            "id",
            profile.id
          );


      if (error) {

        console.error(
          "subscription.create update failed:",
          error
        );


        return NextResponse.json(
          {
            success: false,
          },
          {
            status: 500,
          }
        );
      }


      console.log(
        "Paystack subscription recorded."
      );


      return NextResponse.json({
        received: true,
      });
    }


    // =====================================
    // 6. INVOICE CREATED
    // =====================================

    if (
      eventType ===
      "invoice.create"
    ) {

      /*
       * This normally occurs before
       * Paystack attempts the subscription
       * debit.
       *
       * No access change required.
       */

      console.log(
        "Grossary Plus invoice created:",
        data?.invoice_code
      );


      return NextResponse.json({
        received: true,
      });
    }


    // =====================================
    // 7. SUCCESSFUL SUBSCRIPTION PAYMENT
    // =====================================

    if (
      eventType ===
      "invoice.update"
    ) {

      /*
       * Paystack says invoice.update is
       * sent after the charge attempt.
       *
       * Only activate when the invoice
       * explicitly says it was paid.
       */

      const paid =
        data?.paid === true;


      const invoiceStatus =
        data?.status;


      if (!paid) {

        console.log(
          "Invoice update was not paid:",
          invoiceStatus
        );


        return NextResponse.json({
          received: true,
        });
      }


      const now =
        new Date();


      let periodStart =
        data?.period_start
          ? new Date(
              data.period_start
            )
          : now;


      let periodEnd;


      if (
        data?.period_end
      ) {

        periodEnd =
          new Date(
            data.period_end
          );

      } else {

        /*
         * Fallback only.
         *
         * Paystack's invoice period should
         * normally provide the billing
         * period.
         */

        periodEnd =
          new Date(
            periodStart
          );


        periodEnd.setMonth(
          periodEnd.getMonth() +
          1
        );
      }


      const {
        error,
      } =
        await adminSupabase
          .from("users_info")
          .update({

            is_plus:
              true,

            plus_status:
              "active",

            plus_current_period_start:
              periodStart.toISOString(),

            plus_current_period_end:
              periodEnd.toISOString(),

          })
          .eq(
            "id",
            profile.id
          );


      if (error) {

        console.error(
          "Successful subscription payment update failed:",
          error
        );


        return NextResponse.json(
          {
            success: false,
          },
          {
            status: 500,
          }
        );
      }


      console.log(
        "Grossary Plus subscription ACTIVE:",
        profile.id
      );


      return NextResponse.json({
        received: true,
      });
    }


    // =====================================
    // 8. PAYMENT FAILED
    // =====================================

    if (
      eventType ===
      "invoice.payment_failed"
    ) {

      /*
       * Don't immediately remove access.
       *
       * We'll introduce a grace period
       * separately.
       */

      const {
        error,
      } =
        await adminSupabase
          .from("users_info")
          .update({

            plus_status:
              "past_due",

          })
          .eq(
            "id",
            profile.id
          );


      if (error) {

        console.error(
          "Failed payment update failed:",
          error
        );


        return NextResponse.json(
          {
            success: false,
          },
          {
            status: 500,
          }
        );
      }


      console.log(
        "Grossary Plus payment PAST DUE:",
        profile.id
      );


      return NextResponse.json({
        received: true,
      });
    }


    // =====================================
    // 9. SUBSCRIPTION NOT RENEWING
    // =====================================

    if (
      eventType ===
      "subscription.not_renew"
    ) {

      /*
       * The customer has cancelled,
       * but their paid/trial access should
       * continue until the appropriate
       * period ends.
       */

      const {
        error,
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
            profile.id
          );


      if (error) {

        console.error(
          "Non-renewing update failed:",
          error
        );


        return NextResponse.json(
          {
            success: false,
          },
          {
            status: 500,
          }
        );
      }


      console.log(
        "Grossary Plus will not renew:",
        profile.id
      );


      return NextResponse.json({
        received: true,
      });
    }


    // =====================================
    // 10. SUBSCRIPTION DISABLED
    // =====================================

    if (
      eventType ===
      "subscription.disable"
    ) {

      const {
        error,
      } =
        await adminSupabase
          .from("users_info")
          .update({

            is_plus:
              false,

            plus_status:
              "cancelled",

            plus_cancel_at_period_end:
              false,

          })
          .eq(
            "id",
            profile.id
          );


      if (error) {

        console.error(
          "Subscription disable update failed:",
          error
        );


        return NextResponse.json(
          {
            success: false,
          },
          {
            status: 500,
          }
        );
      }


      console.log(
        "Grossary Plus subscription DISABLED:",
        profile.id
      );


      return NextResponse.json({
        received: true,
      });
    }


    // =====================================
    // 11. CHARGE SUCCESS
    // =====================================

    if (
      eventType ===
      "charge.success"
    ) {

      /*
       * Don't activate Plus from this event.
       *
       * Grossary may eventually use
       * Paystack for other payments.
       *
       * invoice.update gives us better
       * subscription context.
       */

      console.log(
        "Paystack charge.success acknowledged."
      );


      return NextResponse.json({
        received: true,
      });
    }


    // =====================================
    // 12. OTHER EVENT
    // =====================================

    console.log(
      "Unhandled Paystack event:",
      eventType
    );


    return NextResponse.json({
      received: true,
    });


  } catch (error) {

    console.error(
      "Paystack webhook error:",
      error
    );


    /*
     * Return 500 so Paystack knows
     * processing failed and can retry.
     */

    return NextResponse.json(
      {
        success: false,
        error: "WEBHOOK_ERROR",
      },
      {
        status: 500,
      }
    );
  }
}