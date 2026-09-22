"use client";

import {
  useSearchParams,
} from "next/navigation";

import {
  useState,
} from "react";


export default function SubscribeButton() {

  const searchParams =
    useSearchParams();


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState("");


  async function handleSubscribe() {

    try {

      setLoading(
        true
      );

      setError(
        ""
      );


      const returnTo =
        searchParams.get(
          "returnTo"
        ) ||
        "/";


      const response =
        await fetch(
          "/api/grossary-plus/subscription/initialize",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                returnTo,
              }),
          }
        );


      const data =
        await response.json();


      console.log(
        "Grossary Plus subscription:",
        data
      );


      if (
        !response.ok
      ) {

        throw new Error(
          data?.message ||
          "Unable to start subscription."
        );
      }


      if (
        !data
          ?.authorizationUrl
      ) {

        throw new Error(
          "Paystack checkout URL was not returned."
        );
      }


      // ==================================
      // SEND USER TO PAYSTACK
      // ==================================

      window.location.href =
        data.authorizationUrl;


    } catch (error) {

      console.error(
        "Subscribe error:",
        error
      );


      setError(
        error?.message ||
        "Something went wrong."
      );


      setLoading(
        false
      );
    }
  }


  return (

    <div
      className="
        mt-6
      "
    >

      <button
        type="button"

        disabled={
          loading
        }

        onClick={
          handleSubscribe
        }

        className="
          w-full
          rounded-xl
          bg-[#0B2E1E]
          px-5
          py-4
          font-semibold
          text-white
          transition
          hover:opacity-90
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >

        {
          loading
            ? "Opening secure checkout..."
            : "Claim 7-Day Free Trial"
        }

      </button>


      {
        error && (

          <p
            className="
              mt-3
              text-center
              text-sm
              text-red-600
            "
          >
            {error}
          </p>

        )
      }


      <p
        className="
          mt-3
          text-center
          text-xs
          text-gray-500
        "
      >
        R1 refundable card verification.
        Then R39/month after your
        7-day free trial.
     You can cancel anytime before your trial ends and you won`t be charged.
      </p>

    </div>
  );
}