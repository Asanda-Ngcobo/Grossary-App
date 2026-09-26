"use client";

import {
  useState,
} from "react";

import {
  X,
} from "@deemlol/next-icons";

import {
  useRouter,
} from "next/navigation";



import GrossaryPlusLoading from "./GrossaryPlusLoading";
import GrossaryPlusResults from "./GrossaryPlusResults";
import toast from "react-hot-toast";


function GrossaryPlusBunner({
  results,
  optimizing,
  GrossaryPlusRun,
  setGrossaryPlusRun,
  listId,
}) {

  const [
    savingPlan,
    setSavingPlan,
  ] =
    useState(false);

    const router =
  useRouter();
  async function handleSelectPlan(
  basketTotal,
  savings
) {

  try {

    setSavingPlan(true);


    const response =
      await fetch(
        "/api/grossary-plus/select-plan",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              listId,
              basketTotal,
              savings,
              result:
                results,
            }),
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Unable to save shopping plan."
      );

    }


    console.log(
      "Grossary Plus plan saved:",
      data
    );


    /*
     * Revalidate/refetch the current
     * list page.
     *
     * This allows the newly saved:
     *
     * recommended_price
     * recommended_retailer
     * recommended_store_name
     * grossary_plus_plan
     * grossary_plus_savings
     *
     * to appear without the user
     * manually refreshing.
     */

    router.refresh();
  

    /*
     * Close Grossary+ results.
     */

    setGrossaryPlusRun(prev => !prev)


    /*
     * Success notification.
     */

    toast.success(
      "Grossary+ shopping plan added to your list."
    );


  } catch (error) {

    console.error(
      "Failed to save Grossary Plus plan:",
      error
    );


    toast.error(
      error.message ||
      "We couldn't update your list."
    );


  } finally {

    setSavingPlan(false);

  }
}
  return (
    <div
      className="
        fixed
        inset-0
        z-50
        bg-[#F7FAF8]
        overflow-y-auto
      "
    >

      <header
        className="
          sticky
          top-0
          z-20
          bg-white
          border-b
          border-gray-100
        "
      >

        <div
          className="
            max-w-3xl
            mx-auto
            px-4
            py-4
            flex
            items-center
            justify-between
          "
        >

          <div>

            <p
              className="
                font-bold
                text-[#0B2E1E]
              "
            >
              Grossary Plus
            </p>

            <p
              className="
                text-xs
                text-gray-500
              "
            >
              Your optimised shopping plan
            </p>

          </div>



        </div>

      </header>


      <main
        className="
          max-w-3xl
          mx-auto
          px-4
          py-6
          pb-24
        "
      >

        {optimizing ? (

          <GrossaryPlusLoading />

        ) : (

          <GrossaryPlusResults
            results={
              results
            }
            onSelectPlan={
              handleSelectPlan
            }
            savingPlan={
              savingPlan
            }
          />

        )}

      </main>

    </div>
  );
}


export default GrossaryPlusBunner;