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
  error,
  onRetry,
  setGrossaryPlusRun,
  listId,
  setplus
}) {

  const [
    savingPlan,
    setSavingPlan,
  ] =
    useState(false);

    const router =
  useRouter();


  function compactGrossaryPlusItem(item) {
  if (!item) return null;

  const requestedItem = item.requestedItem;

  const product = item.product;

  return {
    matched: item.matched,

    itemId: item.itemId,

    requestedItem: requestedItem
      ? {
          id: requestedItem.id,
          item_name: requestedItem.item_name,
        }
      : null,

    selectedRetailer: item.selectedRetailer,
    retailer: item.retailer,
    storeId: item.storeId,
    storeName: item.storeName,
    branchName: item.branchName,
    unitPrice: item.unitPrice,
    productName: item.productName,

    product: product
      ? {
          storeId: product.storeId,
          storeName: product.storeName,
          branchName: product.branchName,
          price: product.price,
          productName: product.productName,
          imageUrl: product.imageUrl || null,
        }
      : null,
  };
}
  function compactGrossaryPlusResult(results) {
  const data = results?.result || results;
  const optimization = data?.optimization;

  if (!optimization) {
    throw new Error("Optimization result is missing.");
  }

  const optimized = optimization.optimized;
  const cheapest = optimization.singleStoreOptions?.cheapest;

  return {
    shoppingLocation: data.shoppingLocation,

    optimization: {
      location: optimization.location,
      complete: optimization.complete,
      itemCount: optimization.itemCount,
      matchedCount: optimization.matchedCount,
      unmatchedCount: optimization.unmatchedCount,

      unmatchedItems: Array.isArray(optimization.unmatchedItems)
        ? optimization.unmatchedItems.map(() => null)
        : [],

      optimized: optimized
        ? {
            total: optimized.total,
            items: (optimized.items || []).map(
              compactGrossaryPlusItem
            ),
          }
        : null,

      singleStoreOptions: {
        cheapest: cheapest
          ? {
              retailer: cheapest.retailer,
              storeId: cheapest.storeId,
              storeName: cheapest.storeName,
              branchName: cheapest.branchName,
              total: cheapest.total,
              partial: cheapest.partial,
              complete: cheapest.complete,
              matchedCount: cheapest.matchedCount,
              unmatchedCount: cheapest.unmatchedCount,

              items: (cheapest.items || []).map(
                compactGrossaryPlusItem
              ),
            }
          : null,
      },
    },
  };
}
  
async function handleSelectPlan(basketTotal, savings) {
  try {
    setSavingPlan(true);

    const compactResults = compactGrossaryPlusResult(results);

    const payload = {
      listId,
      basketTotal,
      savings,
      result: compactResults,
    };

    console.log(
      "Grossary Plus select-plan payload size:",
      new Blob([JSON.stringify(payload)]).size,
      "bytes"
    );

    const response = await fetch(
      "/api/grossary-plus/select-plan",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to save shopping plan."
      );
    }

    console.log("Grossary Plus plan saved:", data);

    router.refresh();

    setGrossaryPlusRun((prev) => !prev);

    toast.success(
      "Grossary+ shopping plan added to your list.",
      {
        duration: 5000,
        style: {
          background: "#0B2E1E",
          color: "#fff",
        },
      }
    );
  } catch (error) {
    console.error(
      "Failed to save Grossary Plus plan:",
      error
    );

    toast.error(
      error.message || "We couldn't update your list.",
      {
        duration: 5000,
        style: {
          background: "#0B2E1E",
          color: "#fff",
        },
      }
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
            error={error}
            onRetry={onRetry}
            setGrossaryPlusRun={setGrossaryPlusRun}
            setplus={setplus}
          />

        )}

      </main>

    </div>
  );
}


export default GrossaryPlusBunner;