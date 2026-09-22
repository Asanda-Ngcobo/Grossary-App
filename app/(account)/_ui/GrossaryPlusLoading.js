"use client";

import {
  useEffect,
  useState,
} from "react";


const steps = [

  {
    title:
      "Finding nearby stores",

    description:
      "Finding Checkers and Pick n Pay stores you can shop at from one location.",

    emoji:
      "📍",
  },

  {
    title:
      "Checking Checkers prices",

    description:
      "Looking for the items on your grocery list at Checkers.",

    emoji:
      "🛒",
  },

  {
    title:
      "Checking Pick n Pay prices",

    description:
      "Looking for the same items at Pick n Pay.",

    emoji:
      "🛍️",
  },

  {
    title:
      "Comparing your basket",

    description:
      "Comparing prices item-by-item to find the cheaper option.",

    emoji:
      "⚖️",
  },

  {
    title:
      "Calculating your savings",

    description:
      "Checking whether splitting your basket between stores actually saves you money.",

    emoji:
      "💰",
  },

  {
    title:
      "Preparing your shopping plan",

    description:
      "Putting together the best way to shop your grocery list.",

    emoji:
      "✨",
  },

];


function GrossaryPlusLoading() {

  const [
    currentStep,
    setCurrentStep,
  ] =
    useState(0);


  useEffect(
    () => {

      /*
       * Because the API currently returns
       * everything at once, these are
       * presentation steps rather than
       * live backend events.
       */

      const interval =
        setInterval(
          () => {

            setCurrentStep(
              previousStep => {

                /*
                 * Stay on the final stage
                 * until the API responds.
                 */
                if (
                  previousStep >=
                  steps.length - 1
                ) {

                  return previousStep;
                }


                return (
                  previousStep +
                  1
                );
              }
            );

          },
          2500
        );


      return () =>
        clearInterval(
          interval
        );

    },
    []
  );


  const progress =
    (
      (
        currentStep +
        1
      ) /
      steps.length
    ) *
    100;


  const activeStep =
    steps[
      currentStep
    ];


  return (
    <div>

      {/* ================================= */}
      {/* INTRO */}
      {/* ================================= */}

      <div
        className="
          mb-8
        "
      >

        <p
          className="
            text-xs
            font-bold
            tracking-wider
            text-[#1EC677]
            uppercase
          "
        >
          Grossary Plus
        </p>

        <h1
          className="
            text-2xl
            sm:text-3xl
            font-bold
            text-[#0B2E1E]
            mt-1
          "
        >
          Optimising your grocery list
        </h1>

        <p
          className="
            text-sm
            sm:text-base
            text-gray-500
            mt-2
            max-w-xl
          "
        >
          We are comparing your items across nearby stores to find the best way to shop your list.
        </p>

      </div>


      {/* ================================= */}
      {/* ACTIVE STEP CARD */}
      {/* ================================= */}

      <div
        className="
          bg-[#0B2E1E]
          rounded-3xl
          p-6
          sm:p-8
          text-white
          shadow-sm
        "
      >

        <div
          className="
            flex
            items-start
            gap-4
          "
        >

          <div
            className="
              w-14
              h-14
              flex-shrink-0
              rounded-2xl
              bg-white/10
              flex
              items-center
              justify-center
              text-2xl
            "
          >
            {activeStep.emoji}
          </div>


          <div
            className="
              flex-1
            "
          >

            <p
              className="
                text-xs
                font-semibold
                text-[#1EC677]
              "
            >
              STEP{" "}
              {currentStep + 1}
              {" "}OF{" "}
              {steps.length}
            </p>


            <h2
              className="
                text-xl
                font-bold
                mt-1
              "
            >
              {activeStep.title}
            </h2>


            <p
              className="
                text-sm
                text-white/70
                mt-2
                leading-relaxed
              "
            >
              {activeStep.description}
            </p>

          </div>

        </div>


        {/* Progress bar */}

        <div
          className="
            mt-6
            h-2
            bg-white/10
            rounded-full
            overflow-hidden
          "
        >

          <div
            className="
              h-full
              bg-[#1EC677]
              rounded-full
              transition-all
              duration-700
            "
            style={{
              width:
                `${progress}%`,
            }}
          />

        </div>


        <div
          className="
            flex
            justify-between
            mt-2
            text-xs
            text-white/50
          "
        >

          <span>
            Working...
          </span>

          <span>
            {Math.round(
              progress
            )}
            %
          </span>

        </div>

      </div>


      {/* ================================= */}
      {/* STEP LIST */}
      {/* ================================= */}

      <div
        className="
          bg-white
          rounded-3xl
          border
          border-gray-100
          mt-5
          overflow-hidden
        "
      >

        {steps.map(
          (
            step,
            index
          ) => {

            const complete =
              index <
              currentStep;

            const active =
              index ===
              currentStep;


            return (
              <div
                key={
                  step.title
                }
                className={`
                  flex
                  items-center
                  gap-4
                  px-5
                  py-4

                  ${
                    index !==
                    steps.length -
                      1
                      ? "border-b border-gray-100"
                      : ""
                  }
                `}
              >

                {/* Status icon */}

                <div
                  className={`
                    w-8
                    h-8
                    rounded-full
                    flex
                    flex-shrink-0
                    items-center
                    justify-center
                    text-sm
                    font-bold
                    transition

                    ${
                      complete
                        ? "bg-[#1EC677] text-white"
                        : active
                        ? "bg-[#E9FFF4] text-[#1EC677]"
                        : "bg-gray-100 text-gray-400"
                    }
                  `}
                >

                  {complete ? (
                    "✓"
                  ) : active ? (
                    <div
                      className="
                        w-3
                        h-3
                        rounded-full
                        border-2
                        border-[#1EC677]
                        border-t-transparent
                        animate-spin
                      "
                    />
                  ) : (
                    index +
                    1
                  )}

                </div>


                <div>

                  <p
                    className={`
                      text-sm
                      font-semibold

                      ${
                        active ||
                        complete
                          ? "text-[#0B2E1E]"
                          : "text-gray-400"
                      }
                    `}
                  >
                    {step.title}
                  </p>


                  {active && (

                    <p
                      className="
                        text-xs
                        text-gray-500
                        mt-1
                      "
                    >
                      In progress
                    </p>

                  )}

                </div>

              </div>
            );
          }
        )}

      </div>


      <p
        className="
          text-center
          text-xs
          text-gray-400
          mt-5
        "
      >
        Please keep Grossary open while we optimise your list.
      </p>

    </div>
  );
}


export default GrossaryPlusLoading;