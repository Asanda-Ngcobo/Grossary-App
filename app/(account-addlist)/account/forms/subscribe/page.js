import Link from "next/link";
import { redirect } from "next/navigation";

import SubscribeButton from "./SubscribeButton";

import {
  createClient,
} from "@/app/_utils/supabase/server";


// ========================================
// SUBSCRIBE PAGE
// ========================================

export default async function SubscribePage() {

  // ======================================
  // 1. GET AUTHENTICATED USER
  // ======================================

  const supabase =
    await createClient();


  const {
    data: {
      user,
    },
  } =
    await supabase
      .auth
      .getUser();


  // ======================================
  // 2. REQUIRE LOGIN
  // ======================================

  if (!user) {

    redirect(
      "/auth/login"
    );

  }


  // ======================================
  // 3. GET SUBSCRIPTION DETAILS
  // ======================================

  const {
    data:
      profile,

    error:
      profileError,
  } =
    await supabase
      .from(
        "users_info"
      )
      .select(`
        plus_trial_used,
        is_plus,
        plus_status
      `)
      .eq(
        "id",
        user.id
      )
      .single();


  if (profileError) {

    console.error(
      "Unable to load Grossary Plus subscription:",
      profileError
    );

  }


  // ======================================
  // 4. TRIAL ELIGIBILITY
  // ======================================

  const trialEligible =
    profile?.plus_trial_used !==
    true;


  return (

    <main
      className="
        min-h-screen
        bg-[#F7FAF8]
        px-4
        py-12
      "
    >

      <div
        className="
          max-w-lg
          mx-auto
        "
      >

        {/* =================================
            HEADER
        ================================= */}

        <div
          className="
            text-center
          "
        >

          <div
            className="
              inline-flex
              bg-[#0B2E1E]
              text-white
              font-bold
              rounded-2xl
              px-4
              py-2
            "
          >
            grossary
            <span
              className="
                text-[#1EC677]
              "
            >
              plus
            </span>
          </div>


          <h1
            className="
              text-3xl
              font-bold
              text-[#0B2E1E]
              mt-5
            "
          >
            Save up to{" "}
            <span
              className="
                text-[#1EC677]
              "
            >
              R100
            </span>{" "}
            per 6 Items
          </h1>


          <p
            className="
              text-gray-500
              mt-3
            "
          >
            grossary plus compares your
            grocery list across participating
            nearby stores and shows you where
            each item is cheaper.
          </p>

        </div>


        {/* =================================
            PRICING CARD
        ================================= */}

        <div
          className="
            bg-white
            border
            border-gray-100
            rounded-3xl
            p-6
            mt-8
          "
        >

          {/* PRICE */}

          <div
            className="
              flex
              items-end
              gap-1
            "
          >

            <span
              className="
                text-4xl
                font-bold
                text-[#0B2E1E]
              "
            >
              R39
            </span>


            <span
              className="
                text-gray-500
                mb-1
              "
            >
              /month
            </span>

          </div>


          {/* =================================
              FREE TRIAL

              Only show this if the user
              has never used their trial.
          ================================= */}

          {trialEligible && (

            <p
              className="
                text-[#1EC677]
                font-semibold
                mt-2
              "
            >
              First 7 days free
            </p>

          )}


          <div
            className="
              border-t
              border-gray-100
              my-6
            "
          />


          {/* =================================
              FEATURES
          ================================= */}

          <div
            className="
              space-y-4
              text-sm
              text-[#0B2E1E]
            "
          >

            <p>
              ✓ Compare your list across
              nearby stores
            </p>

            <p>
              ✓ Find the cheapest store
              for each item
            </p>

            <p>
              ✓ Get your best-value
              shopping plan
            </p>

            <p>
              ✓ Compare it with the
              convenience of one store
            </p>

            <p>
              ✓ See retailer promotional
              savings
            </p>

          </div>


          {/* =================================
              SUBSCRIBE
          ================================= */}

          <SubscribeButton
            trialEligible={
              trialEligible
            }
          />


          {/* =================================
              SUBSCRIPTION TERMS
          ================================= */}

          <p
            className="
              text-xs
              text-gray-400
              text-center
              leading-5
              mt-4
            "
          >

            {trialEligible
              ? "   R1 refundable card verification now. Then, R39/month after your 7-day free trial. Cancel anytime."
              : "R39/month. Cancel anytime."}

          </p>


          <div
            className="
              flex
              justify-center
              gap-3
              flex-wrap
              mt-2
              text-xs
              text-gray-400
            "
          >

            <Link
              href="/company/cancellationpolicy"
              className="
                underline
                hover:text-[#0B2E1E]
              "
            >
              Cancellation Policy
            </Link>


            <Link
              href="/company/terms"
              className="
                underline
                hover:text-[#0B2E1E]
              "
            >
              Terms
            </Link>


            <Link
              href="/company/privacy"
              className="
                underline
                hover:text-[#0B2E1E]
              "
            >
              Privacy
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}