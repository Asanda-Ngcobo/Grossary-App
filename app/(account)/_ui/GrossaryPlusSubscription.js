"use client";

import {
  useEffect,
  useState,
} from "react";


export default function GrossaryPlusSubscription() {

  const [
    subscription,
    setSubscription,
  ] =
    useState(null);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    cancelling,
    setCancelling,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    showCancelConfirm,
    setShowCancelConfirm,
  ] =
    useState(false);


  // =====================================
  // LOAD SUBSCRIPTION
  // =====================================

  async function loadSubscription() {

    try {

      setLoading(true);
      setError("");


      const response =
        await fetch(
          "/api/grossary-plus/subscription/status",
          {
            cache: "no-store",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data?.message ||
          "Unable to load subscription."
        );
      }


      setSubscription(
        data.subscription
      );


    } catch (error) {

      console.error(
        "Subscription load error:",
        error
      );


      setError(
        error?.message ||
        "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(
    () => {

      loadSubscription();

    },
    []
  );


  // =====================================
  // CANCEL
  // =====================================

  async function handleCancel() {

    try {

      setCancelling(true);
      setError("");


      const response =
        await fetch(
          "/api/grossary-plus/subscription/cancel",
          {
            method: "POST",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data?.message ||
          "Unable to cancel subscription."
        );
      }


      setShowCancelConfirm(
        false
      );


      await loadSubscription();


    } catch (error) {

      console.error(
        "Cancellation error:",
        error
      );


      setError(
        error?.message ||
        "Something went wrong."
      );

    } finally {

      setCancelling(false);

    }
  }


  // =====================================
  // DATE FORMAT
  // =====================================

  function formatDate(date) {

    if (!date) {
      return "—";
    }


    return new Intl.DateTimeFormat(
      "en-ZA",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ).format(
      new Date(date)
    );
  }


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-6
        "
      >
        Loading Grossary+...
      </div>

    );
  }


  if (!subscription) {
    return null;
  }


  // =====================================
  // DISPLAY VALUES
  // =====================================

  const isTrial =
    subscription.status ===
    "trialing";


  const isActive =
    subscription.status ===
    "active";


  const isCancelling =
    subscription.cancelAtPeriodEnd ===
    true;


  const accessEndDate =
    isTrial
      ? subscription.trialEndsAt
      : subscription.currentPeriodEnd;


  // =====================================
  // UI
  // =====================================

  return (

    <section
      className="
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
        w-[80%]
      "
    >

      <div
        className="
          flex
          flex-col
          gap-6
          md:flex-row
          md:items-start
          md:justify-between
        "
      >

        <div>

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <h2
              className="
                text-2xl
                font-bold
                text-[#0B2E1E]
              "
            >
              grossary<span className="text-[#1EC677]">+</span>
            </h2>


            <span
              className="
                rounded-full
                bg-[#E8F8EF]
                px-3
                py-1
                text-xs
                font-semibold
                text-[#0B2E1E]
              "
            >

              {
                isTrial
                  ? "Free Trial"
                  : isActive
                    ? "Active"
                    : subscription.status
              }

            </span>

          </div>


          <p
            className="
              mt-2
              text-gray-500
            "
          >
            R39/month
          </p>

        </div>


        {
          subscription.isPlus && (

            <div
              className="
                text-left
                md:text-right
              "
            >

              {
                isTrial && (

                  <>
                    <p
                      className="
                        font-semibold
                        text-[#0B2E1E]
                      "
                    >
                      {
                        subscription
                          .trialDaysRemaining
                      }{" "}
                      days remaining
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-gray-500
                      "
                    >
                      Trial ends{" "}
                      {
                        formatDate(
                          subscription
                            .trialEndsAt
                        )
                      }
                    </p>
                  </>

                )
              }


              {
                isActive && (

                  <>
                    <p
                      className="
                        font-semibold
                        text-[#0B2E1E]
                      "
                    >
                      Next billing date
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-gray-500
                      "
                    >
                      {
                        formatDate(
                          subscription
                            .nextPaymentDate
                        )
                      }
                    </p>
                  </>

                )
              }

            </div>

          )
        }

      </div>


      <div
        className="
          my-6
          border-t
          border-gray-100
        "
      />


      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
        "
      >

        <div>

          <p
            className="
              text-xs
              uppercase
              tracking-wide
              text-gray-400
            "
          >
            Plan
          </p>

          <p
            className="
              mt-1
              font-medium
              text-gray-800
            "
          >
            grossary<span className="text-[#1EC677]">+</span> Monthly
          </p>

        </div>


        <div>

          <p
            className="
              text-xs
              uppercase
              tracking-wide
              text-gray-400
            "
          >
            Price
          </p>

          <p
            className="
              mt-1
              font-medium
              text-gray-800
            "
          >
            R39 / month
          </p>

        </div>


        <div>

          <p
            className="
              text-xs
              uppercase
              tracking-wide
              text-gray-400
            "
          >
            Status
          </p>

          <p
            className="
              mt-1
              font-medium
              text-gray-800
            "
          >
            {
              isCancelling
                ? "Cancelling"
                : isTrial
                  ? "Free trial"
                  : isActive
                    ? "Active"
                    : subscription.status
            }
          </p>

        </div>


        <div>

          <p
            className="
              text-xs
              uppercase
              tracking-wide
              text-gray-400
            "
          >

            {
              isCancelling
                ? "Access until"
                : isTrial
                  ? "First payment"
                  : "Next payment"
            }

          </p>


          <p
            className="
              mt-1
              font-medium
              text-gray-800
            "
          >

            {
              formatDate(
                isTrial
                  ? subscription
                      .nextPaymentDate ||
                    subscription
                      .trialEndsAt
                  : isCancelling
                    ? accessEndDate
                    : subscription
                        .nextPaymentDate
              )
            }

          </p>

        </div>

      </div>


      {
        isCancelling && (

          <div
            className="
              mt-6
              rounded-xl
              bg-gray-50
              p-4
            "
          >

            <p
              className="
                text-sm
                text-gray-600
              "
            >
              Your grossary+ subscription
              has been cancelled and will
              not renew.

              {
                accessEndDate && (
                  <>
                    {" "}You can continue
                    using grossary<span className="text-[#1EC677]">plus</span> until{" "}
                    <strong>
                      {
                        formatDate(
                          accessEndDate
                        )
                      }
                    </strong>.
                  </>
                )
              }

            </p>

          </div>

        )
      }


      {
        error && (

          <p
            className="
              mt-5
              text-sm
              text-red-600
            "
          >
            {error}
          </p>

        )
      }


      {
        subscription.isPlus &&
        !isCancelling && (

          <div
            className="
              mt-7
            "
          >

            {
              !showCancelConfirm
                ? (

                  <button
                    type="button"

                    onClick={
                      () =>
                        setShowCancelConfirm(
                          true
                        )
                    }

                    className="
                      text-sm
                      font-medium
                      text-red-600
                      hover:underline
                    "
                  >
                    Cancel grossary+
                  </button>

                )
                : (

                  <div
                    className="
                      rounded-2xl
                      border
                      border-red-100
                      bg-red-50
                      p-5
                    "
                  >

                    <p
                      className="
                        font-semibold
                        text-gray-900
                      "
                    >
                      Cancel grossary<span className="text-[#1EC677]">+</span>?
                    </p>


                    <p
                      className="
                        mt-2
                        text-sm
                        text-gray-600
                      "
                    >

                      {
                        isTrial
                          ? "Your subscription will not renew after your free trial."
                          : "Your subscription will not renew after your current billing period."
                      }

                    </p>


                    <div
                      className="
                        mt-5
                        flex
                        gap-3
                      "
                    >

                      <button
                        type="button"

                        disabled={
                          cancelling
                        }

                        onClick={
                          handleCancel
                        }

                        className="
                          rounded-xl
                          bg-red-600
                          px-4
                          py-2
                          text-sm
                          font-semibold
                          text-white
                          disabled:opacity-50
                        "
                      >

                        {
                          cancelling
                            ? "Cancelling..."
                            : "Yes, cancel"
                        }

                      </button>


                      <button
                        type="button"

                        disabled={
                          cancelling
                        }

                        onClick={
                          () =>
                            setShowCancelConfirm(
                              false
                            )
                        }

                        className="
                          rounded-xl
                          border
                          border-gray-200
                          bg-white
                          px-4
                          py-2
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        Keep grossary<span className="text-[#1EC677]">+</span>
                      </button>

                    </div>

                  </div>

                )
            }

          </div>

        )
      }

    </section>
  );
}