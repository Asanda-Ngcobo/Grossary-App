"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";


export default function
GrossaryPlusCallbackPage() {

  const router =
    useRouter();


  const searchParams =
    useSearchParams();


  const hasVerified =
    useRef(false);


  const [
    status,
    setStatus,
  ] =
    useState(
      "verifying"
    );


  const [
    error,
    setError,
  ] =
    useState("");


  useEffect(
    () => {

      if (
        hasVerified.current
      ) {
        return;
      }


      hasVerified.current =
        true;


      async function verify() {

        try {

          const reference =
            searchParams.get(
              "reference"
            ) ||
            searchParams.get(
              "trxref"
            );


          const returnTo =
            searchParams.get(
              "returnTo"
            ) ||
            "/";


          if (
            !reference
          ) {

            throw new Error(
              "Paystack transaction reference was not returned."
            );
          }


          console.log(
            "Paystack callback reference:",
            reference
          );


          const response =
            await fetch(
              "/api/grossary-plus/subscription/verify",
              {
                method:
                  "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body:
                  JSON.stringify({
                    reference,
                  }),
              }
            );


          const data =
            await response
              .json();


          console.log(
            "Grossary Plus verification:",
            data
          );


          if (
            !response.ok
          ) {

            throw new Error(
              data?.message ||
              "Unable to activate Grossary Plus."
            );
          }


          setStatus(
            "success"
          );


          // Give the user a moment to
          // see the success state.

          setTimeout(
            () => {

              router.replace(
                returnTo
              );

            },
            2000
          );


        } catch (error) {

          console.error(
            "Verification failed:",
            error
          );


          setError(
            error?.message ||
            "Something went wrong."
          );


          setStatus(
            "error"
          );

        }
      }


      verify();

    },
    [
      router,
      searchParams,
    ]
  );


  // =====================================
  // VERIFYING
  // =====================================

  if (
    status ===
    "verifying"
  ) {

    return (

      <main
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-[#F7FAF8]
          px-4
        "
      >

        <div
          className="
            max-w-md
            text-center
          "
        >

          <div
            className="
              mx-auto
              h-12
              w-12
              animate-spin
              rounded-full
              border-4
              border-gray-200
              border-t-[#1EC677]
            "
          />


          <h1
            className="
              mt-6
              text-2xl
              font-bold
              text-[#0B2E1E]
            "
          >
            Activating Grossary Plus
          </h1>


          <p
            className="
              mt-2
              text-gray-500
            "
          >
            We`re securely verifying
            your payment method.
          </p>

        </div>

      </main>
    );
  }


  // =====================================
  // SUCCESS
  // =====================================

  if (
    status ===
    "success"
  ) {

    return (

      <main
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-[#F7FAF8]
          px-4
        "
      >

        <div
          className="
            max-w-md
            text-center
          "
        >

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-[#1EC677]
              text-3xl
              text-white
            "
          >
            ✓
          </div>


          <h1
            className="
              mt-6
              text-3xl
              font-bold
              text-[#0B2E1E]
            "
          >
            Welcome to Grossary+
          </h1>


          <p
            className="
              mt-3
              text-gray-500
            "
          >
            Your 7-day free trial
            is now active.
          </p>


          <p
            className="
              mt-2
              text-sm
              text-gray-400
            "
          >
            Taking you back to your
            grocery list...
          </p>

        </div>

      </main>
    );
  }


  // =====================================
  // ERROR
  // =====================================

  return (

    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#F7FAF8]
        px-4
      "
    >

      <div
        className="
          max-w-md
          text-center
        "
      >

        <h1
          className="
            text-2xl
            font-bold
            text-[#0B2E1E]
          "
        >
          We couldn`t activate
          Grossary Plus
        </h1>


        <p
          className="
            mt-3
            text-gray-500
          "
        >
          {error}
        </p>


        <button
          type="button"

          onClick={
            () =>
              router.push(
                "/account/forms/subscribe"
              )
          }

          className="
            mt-6
            rounded-xl
            bg-[#0B2E1E]
            px-6
            py-3
            font-semibold
            text-white
          "
        >
          Try Again
        </button>

      </div>

    </main>
  );
}