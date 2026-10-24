'use client';

import { useEffect, useMemo, useOptimistic, useState } from 'react';
import { useRouter } from "next/navigation";
import HandleCategories from './add-price/HandleCategories';
import Link from 'next/link';
import { Check, ChevronLeft, Edit, Edit2, MapPin, PenTool, Plus, ShoppingBag, ShoppingCart } from '@deemlol/next-icons';


import IncreaseQuantity from './_listcomponents/IncreaseQuantity';

import AccountModal from '@/app/(account)/_ui/AccountModal';
import { Lexend_Deca, Quicksand } from 'next/font/google';
import ParentFormBackground from '@/app/(account)/account/ParentFormBackground';


import ListMoneySpent from '@/app/(account)/_ui/ListMoneySpent';


import DeleteModal from "@/app/(account)/account/lists/DeleteModal";
import DeleteList from '@/app/(account)/_ui/DeleteList';
import { completeOnboarding, deleteList } from '@/app/_lib/actions';
import AddPriceSheet from '../AddPriceSheet';
import StarterItemsModal from './startItemsModel';

import EditItem from '../EditItem';
import GrossaryPlusBunner from '@/app/(account)/_ui/GrossaryPlusBunner';

import {
  initializeGrossaryPlusSound,
  playGrossaryPlusSuccessSound,
   playGrossaryPlusErrorSound,
} from "@/app/_lib/grocery/utils/playGrossarySound";
import GrossaryTipPopup from '@/app/(account)/_ui/GrossaryTipPopup';
import { supabase } from '@/app/_lib/supabase';
import ConfirmPlusModel from '../../../../(account)/_ui/ConfirmPlus';
import Image from 'next/image';
import {
  PlusError,
  toPlusErrorCode,
} from "@/app/(account)/_ui/plusErrors";


const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

const MoneyFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
});
export default function PageClient({ listId, list_name, 
  list_budget, listitems, groupedItems,profile, lists, savings, plan }) {
 const [selectedCategory, setSelectedCategory] = useState('');
 const [isOpenModal, setIsOpenModal] = useState(false)
 const [showForm, setShowForm] = useState(false)
 const [editingItem, setEditingItem] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [grossaryPlusResult, setGrossaryPlusResult] =
  useState(null);
  const [GrossaryPlusRun, setGrossaryPlusRun] = useState(false)
const [activeRecommendedPriceId, setActiveRecommendedPriceId] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [confirmPlus, setConfirmPlus] = useState(false)
  const [plusError, setPlusError] = useState(null);
const router = useRouter();



//Parse Price

function HandleParseprice(itemId) {
  setActiveRecommendedPriceId((currentId) =>
    currentId === itemId ? null : itemId
  );
}

//Show form
    function HandleShowForm (){
        setShowForm(def => !def)
    }

  //Edit Item  
    function openEditItem(item) {
  setEditingItem(item);
}

//Leave edit item
function closeEditItem() {
  setEditingItem(null);
}

//Show Delete list
      const [isDeleteModal, setIsDeleteModal] = useState(false)
   function handleModal(){
    setIsDeleteModal((isDeleteModal) => !isDeleteModal)
   }

   //add price Form
   const [activeItemId, setActiveItemId] = useState(null);

function openPrice(id) {
  setActiveItemId(id);
}

//Show plus form

  function HandleConfirmPlusForm (){
        setConfirmPlus(def => !def)
    }
   
               //Delete Ui
   
      
       async  function handleDelete(listId){
          
   await deleteList(listId)
       }
  // Load selected category from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('selectedCategory');
    if (stored) setSelectedCategory(stored);
  }, []);

  // Save selected category to localStorage on change
  useEffect(() => {
    if (selectedCategory) {
      localStorage.setItem('selectedCategory', selectedCategory);
    }
  }, [selectedCategory]);

  // Only re-calculate when dependencies change
  const sortedCategoryEntries = useMemo(() => {
    return Object.entries(groupedItems).sort(([catA], [catB]) => {
      if (catA === selectedCategory) return -1;
      if (catB === selectedCategory) return 1;
      return 0;
    });
  }, [groupedItems, selectedCategory]);

//Name
const firstName = profile.fullName?.split(" ")[0] || "there";
  const capitalizedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

//Display List Budget
  const listBudget =  new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 2,
}).format(list_budget);

//Display Money Spent

  const money_spent = listitems.reduce((acc, item) => acc + (item.total_price || 0), 0);
  


  const overallShopped = listitems.filter(item => item.total_price !== null).length;
  const itemsLength = listitems.length;
  const doneShopping = overallShopped === itemsLength;
 
  const toBeShopped = itemsLength - overallShopped;

// Trigger modal only when shopping is completed
useEffect(() => {
  if (overallShopped > 0 && overallShopped === itemsLength) {
    setIsOpenModal(true)
  }
}, [overallShopped, itemsLength])


//questionnaire redirecting

const isFirstList = lists.length === 1 && !profile.surveyed;
//helper

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null; // HTML error pages, empty bodies, gateway timeouts
  }
}

function getPosition(options) {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  );
}

async function getUserPosition() {
  if (!navigator.geolocation) throw new PlusError("GEO_UNSUPPORTED");

  try {
    return await getPosition({ enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 });
  } catch (err) {
    if (err.code === 1) throw err; // denied: retrying won't help
    return await getPosition({ enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 });
  }
}


//handlingGrossaryPlus
async function handleGrossaryPlus() {
  void initializeGrossaryPlusSound();
  HandleConfirmPlusForm();

  setPlusError(null);
  setGrossaryPlusResult(null);

  // Open the banner immediately so ANY failure has somewhere to show
  setGrossaryPlusRun(true);
  setIsOptimizing(true);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      throw new PlusError("OFFLINE");
    }

    // 1. Subscription check
    const statusResponse = await fetch("/api/grossary-plus/status", {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    const statusData = await readJson(statusResponse);

    if (statusResponse.status === 401) throw new PlusError("UNAUTHORIZED", { status: 401 });
    if (!statusResponse.ok || !statusData) {
      throw new PlusError(statusData ? "STATUS_CHECK_FAILED" : "BAD_RESPONSE", {
        status: statusResponse.status,
      });
    }

    if (!statusData.isPlus) {
      setGrossaryPlusRun(false);
      router.push(
        `/account/forms/subscribe?returnTo=${encodeURIComponent(`/account/forms/${listId}`)}`
      );
      return;
    }

    // 2. Location
    setLocationStatus("getting-location");
    const position = await getUserPosition();
    const { latitude, longitude } = position.coords;
    setLocationStatus("location-found");

    // 3. Run Grossary Plus
    const response = await fetch("/api/grossary-plus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listId, latitude, longitude }),
      signal: controller.signal,
    });
    const data = await readJson(response);

    if (response.status === 403 && data?.error === "PLUS_REQUIRED") {
      setGrossaryPlusRun(false);
      router.push(
        `/account/forms/subscribe?returnTo=${encodeURIComponent(`/account/forms/${listId}`)}`
      );
      return;
    }

    if (!response.ok || !data?.success) {
      throw new PlusError(data?.error || "BAD_RESPONSE", {
        status: response.status,
        serverMessage: data?.message,
      });
    }

    setGrossaryPlusResult(data.result);
    void playGrossaryPlusSuccessSound();
  } catch (error) {
    console.error("Failed to activate Grossary Plus:", error);

    setPlusError({
      code: toPlusErrorCode(error),
      serverMessage: error?.serverMessage || null,
    });
    setLocationStatus("error");
    void playGrossaryPlusErrorSound();
  } finally {
    clearTimeout(timeoutId);
    setIsOptimizing(false);
  }
}
//handle onboarding tips

  // Handle onboarding tips
  const [activeTip, setActiveTip] = useState(0);
  const [savingOnboarding, setSavingOnboarding] = useState(false);

  // Show tips only when the profile is not onboarded
useEffect(() => {
  if (profile && profile.onboarded === false && listitems.length > 0) {
    const timer = setTimeout(() => {
      setActiveTip(1);
    }, 2000);

    return () => clearTimeout(timer);
  } else {
    setActiveTip(0);
  }
}, [profile?.onboarded, listitems.length, profile]);

 
async function handleFinishOnboarding() {
  if (savingOnboarding) return;

  setSavingOnboarding(true);

  try {
    const result = await completeOnboarding();

    if (!result.success) {
      console.error("Failed to complete onboarding:", result.error);
      return;
    }

    setActiveTip(0);
  } finally {
    setSavingOnboarding(false);
  }
}

  const tips = [
    {
      title: "Be Specific!",
      description:
        "If your Rice is Tastic Wholegrain Long Grain Brown Rice 2kg,  " +
        "add exactly that rice on your list. " +
        "Before activating Grossary Plus.",
      example:
        "Tastic Wholegrain Long Grain Brown Rice 2kg, instead of just “Rice 2kg”.",
    },
    {
      title: "However!",
      description:
        "If you are looking for just a cheaper rice " +
        "and not brand specific, you can just add",
      example:
        "Rice   2kg.",
    },

     {
      title: "Build a Complete List!",
      description:
        "Add everything you plan to buy before activating Grossary Plus. " +
        "This helps grossary give you a complete shopping plan, helping you maximise your savings.",
 
    },
  ];

  const currentTip =
    activeTip > 0 ? tips[activeTip - 1] : null;

 function handleNextTip() {
  if (activeTip < tips.length) {
    setActiveTip(activeTip + 1);
  } else {
    handleFinishOnboarding();
  }
}

  function handleSkipTips() {
    // Close tips without marking the user as onboarded.
    setActiveTip(0);
  }

  return (
    <div>
      {/* Header Card */}
      <div className="w-[90%]  mx-[5%] sm:w-[80%] sm:mx-[10%]
       md:w-[80%] md:mx-[10%] lg:w-[60%] lg:mx-[20%] mt-[5%] bg-white
       text-black rounded-md shadow-lg px-4 py-4 mb-2">
        <div className="flex items-center justify-between mb-4">
    
        <Link
  href={isFirstList ? "/account/cards" : "/account/lists"}
  className="
    bg-white
    text-black
    rounded-full
    w-10
    h-10
    flex
    items-center
    justify-center
    cursor-pointer
    transition
    active:bg-gray-200
    hover:bg-gray-100
  "
>
  <ChevronLeft />
</Link>
      
          <h1 className="text-xl font-bold text-[#8F8C8C] flex">{list_name}
       
          </h1>
            {/* Right: Buttons */}
      <div className="flex gap-2 items-center w-1/5">
        {/* <EditList id={id} /> */}
        <DeleteList handleModal={handleModal}/>
      </div>
        </div>

        <div className="flex flex-col justify-between font-bold">
           <ListMoneySpent money_spent={money_spent}
           />
           {listitems.recommended_price !== null || <p className='text-xs text-gray-400'>Expected Spending &plusmn;R{plan}</p>}
           {/* <ListMoneyLeft money_left={money_left}/> */}

         
        </div>

   

       <div className="flex flex-col items-center justify-center mt-4 space-y-4">
  
<div className='flex justify-between items-center w-full'>
  <div className='text-sm'>
    {toBeShopped > 0 ? <p>{`${toBeShopped} of ${itemsLength} to be shopped`}</p>: <p>All Shopped</p>}
  </div>
 <HandleCategories
    allItems={Object.values(groupedItems).flat()}
    selectedCategory={selectedCategory}
    setSelectedCategory={setSelectedCategory}
    sortedCategoryEntries={sortedCategoryEntries}
  />
</div>
 
</div>


     
          <button className="bg-[#0B2E1E]
          text-gray-500 active:bg-gray-600 w-[40px] h-[40px] rounded-full
           flex justify-center items-center -mb-8 ml-[90%] cursor-pointer"
           onClick={HandleShowForm}><Plus /></button>
       
      </div>
      {listitems.length === 0 ? 
      <div className='flex justify-center text-[#0B2E1E] font-bold text-2xl  w-[80%] mx-auto items-center mt-10'>
        {/* <p className=' text-center
bottom-5'>Add Your Grocery list items using the Plus button above</p> */}

      </div> : ''}
      


      {/* Items List */}
      <div className="mt-6 space-y-6">
        {sortedCategoryEntries.map(([category, items]) => {
          const categoryTotal = items.reduce((sum, item) => sum + (item.total_price || 0), 0).toFixed(2);
          const shoppedNumber = items.filter(item => item.is_checked).length;
          const totalNumberOfItems = items.length;
          const itemsLeft = totalNumberOfItems - shoppedNumber;

          return (
            <div key={category} className="bg-white text-black w-[90%]  mx-[5%] sm:w-[80%]
             sm:mx-[10%] md:w-[80%] md:mx-[10%] lg:w-[60%] lg:mx-[20%] p-4 rounded-md shadow-md
            max-h-[550px] overflow-y-auto
">
              <div className="border-b border-gray-300 flex flex-row justify-between">
                <h2 className="text-sm font-bold">{category}</h2>
              
                  {itemsLeft === totalNumberOfItems  && <h2>{totalNumberOfItems} items</h2>}
              
                {/* <h2 className='text-xs'>
                  
                  {!itemsLeft ? 'All Shopped 🎉' : (shoppedNumber > 0 ? `${itemsLeft} of ${totalNumberOfItems} left` : '')}
                </h2> */}
                <h2 className="text-sm font-bold">
                  {categoryTotal > 0 && <span>R{categoryTotal}</span>}
                </h2>
              </div>

              <div className="space-y-4">
           
{[...items]
  .sort((a, b) => {
    const aHasPrice = a.price != null;
    const bHasPrice = b.price != null;

    // 1. Items without prices first
    if (aHasPrice !== bHasPrice) {
      return aHasPrice ? 1 : -1;
    }

    // 2. Items with a recommended retailer first,
    // then sort retailers alphabetically
    const aRetailer = a.recommended_retailer?.trim() || "";
    const bRetailer = b.recommended_retailer?.trim() || "";

    if (aRetailer && bRetailer) {
      const retailerOrder = aRetailer.localeCompare(
        bRetailer,
        "en",
        { sensitivity: "base" }
      );

      if (retailerOrder !== 0) {
        return retailerOrder;
      }
    } else if (aRetailer !== bRetailer) {
      return aRetailer ? -1 : 1;
    }

    // 3. Sort product names alphabetically within each retailer
    return a.item_name.localeCompare(b.item_name);
  })


                  .map((item) => (
                    <div key={item.id} className="border-b border-gray-300 pb-3">
                      <div className="flex justify-between text-xs font-semibold mb-2">
                        <div className='h-fit flex-col gap-1 '>
                          <p>{item.item_name}</p>
                            <p className='font-bold'>{item.item_brand}</p>
                        </div>
                      
                        <span>{item.item_volume_mass}{item.item_unit}</span>
                      </div>
                      <form className="flex items-center gap-4 justify-between">

<label
  onClick={() => openPrice(item.id)}
  className="relative flex items-center cursor-pointer"
>
    <input
      type="checkbox"
      checked={item.price !== null}
      readOnly
      className="peer hidden"
    />

    <span
      className="
        w-8 h-8
        rounded-full
        border-2 border-[#0B2E1E]
        flex items-center justify-center
        peer-checked:bg-[#0B2E1E]
        transition
        active:w-10 active:h-10
      "
    >
      {/* Check mark */}
      {item.price !== null && (
        <svg
          className="w-4 h-4 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </span>
  </label>
{item.recommended_retailer && item.price === null && (
  <div
    className="
      relative
      mt-2
      inline-flex
      items-center
      gap-2
      bg-[#F4FFF9]
      border
      border-[#1EC677]/20
      rounded-full
      px-1
      py-1
      cursor-pointer
    "
    onClick={() => HandleParseprice(item.id)}
  >

    {/* Recommended product */}
    {item.recommended_price != null &&
      activeRecommendedPriceId === item.id && (
       
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
  <div
    className="
      w-[min(90vw,320px)]
      overflow-hidden
      rounded-2xl
      border border-gray-100
      bg-white
      shadow-2xl shadow-black/20
      animate-in fade-in zoom-in-95 duration-200
    "
  >
    {/* Product image */}
    <div className="relative flex h-50 w-full items-center justify-center bg-gray-50 p-3">
      {item.image_url ? (
        <Image
          src={item.image_url}
          alt={item.recommended_product_name || "Recommended product"}
          fill
          sizes="(max-width: 420px) 100vw, 420px"
          className="object-contain p-3"
        />
      ) : (
        <ShoppingBag size={36} className="text-gray-300" />
      )}
    </div>

    {/* Product details */}
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col items-start justify-between gap-3">
        <p className="min-w-0 flex-1 text-sm font-semibold leading-5 text-gray-800">
          {item.recommended_product_name || "Recommended product"}
        </p>
       
        <p className="shrink-0 text-lg font-bold text-[#0B2E1E]">
          {Number.isFinite(Number(item.recommended_price))
            ? `R${Number(item.recommended_price).toFixed(2)}`
            : "Price unavailable"}
        </p>

          <p className='flex gap-1'>    <span className="text-xs text-gray-600">
      At
    </span>

    <span
      className={`
        ${
          item.recommended_retailer === "Checkers"
            ? "text-[#38A8AE]"
            : "text-[#003359]"
        }
        text-xs
        font-bold
      `}
    >
      {item.recommended_retailer}
    </span></p>
      </div>

      {item.promotion != null &&
        item.promotion !== "" &&
        Number.isFinite(Number(item.promotion)) && (
          <p className="text-xs font-medium text-emerald-600">
            Promotion: R{Number(item.promotion).toFixed(2)}
          </p>
        )}

      <div className="flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
        <MapPin size={15} className="shrink-0 text-[#1EC677]" />
        <span className="min-w-0 break-words">
          {item.recommended_store_name || "Store unavailable"}
        </span>
      </div>
    </div>
  </div>
</div>

       
      )}

    <span className="text-xs text-gray-600">
      Buy at
    </span>

    <span
      className={`
        ${
          item.recommended_retailer === "Checkers"
            ? "text-[#38A8AE]"
            : "text-[#003359]"
        }
        text-xs
        font-bold
      `}
    >
      {item.recommended_retailer}
    </span>

  </div>
)}

                        <div>
                          {item.price && <p className="text-sm font-bold text-gray-400">R{item.price}</p>}
                          {item.price && <p className="text-sm font-bold
                           text-amber-700"> -R{item.total_price}</p>}
                        </div>

                          

                            <div className="flex flex-row w-[40%] gap-4 justify-between">
                            <IncreaseQuantity itemId={item.id}
                          itemName={item.item_name}
                          itemQuantity={item.item_quantity} listId={listId} />
                          
                       <button
                        type="button"
  onClick={() => openEditItem(item)}
  className="
    w-8 h-8 rounded-full
    flex items-center justify-center
    active:scale-95
    transition-all
  "
>
  <Edit2 size={18} />
</button>

 {editingItem && (
  <ParentFormBackground
    openform={closeEditItem}
    setEditForm={setEditingItem}
    listId={listId}
    itemId={editingItem.id}
    itemName={editingItem.item_name}
    itemBrand={editingItem.item_brand}
    itemMass={editingItem.item_volume_mass}
    itemUnit={editingItem.item_unit}
  >
    <EditItem
      openform={closeEditItem}
      listId={listId}
      itemId={editingItem.id}
      itemName={editingItem.item_name}
      itemBrand={editingItem.item_brand}
      itemMass={editingItem.item_volume_mass}
      itemUnit={editingItem.item_unit}
    />
  </ParentFormBackground>
)}
                        </div>
                      </form>
                    
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
     {isOpenModal  &&
     <AccountModal>
      <div
  className="
    fixed mt-[50%] left-1/2 -translate-x-1/2 z-50
    w-[90%] max-w-lg bg-white text-black
    rounded-2xl shadow-lg px-6 py-8
    flex flex-col items-center text-center space-y-4
    animate-fade-in
  "
>
  <div className="w-20 h-20 flex justify-center items-center rounded-full
   bg-green-500 shadow-md animate-pulse">
    <Check className="text-white text-4xl" />
  </div>

  {doneShopping > 0 && (
    <>
    
      {/* <FireworksComponent /> */}
      <h1 className="text-2xl font-bold text-[[#1EC677] animate-bounce">
        Well Done {capitalizedFirstName}!
      </h1>
      <p className="text-base">
        Your shopping is done and your total is <span className={`text-2xl font-bold
        
          ${MoneyFont.className}`}>
          R{money_spent.toFixed(2)}</span>. 
      </p>
      <p>You can now select the relevant 
        loyalty card and go pay.</p>
       <div className={`${ButtonFont.className} 
   grid gap-6 mt-5 mx-4 `}>

        <button
     
      className="h-10 min-w-[300px] px-2 active:bg-gray-600
       bg-[#1EC677]  cursor-pointer  rounded-lg text-[#04284B]
      font-semibold hover:bg-[#041527] transition-colors"
    >
      <Link href={`/account/cards`}>Go To cards</Link>
    
    </button>
       <button
     
      className="h-10 min-w-[300px] px-2
      active:bg-gray-600 bg-[#E2F3F4]  cursor-pointer  
      rounded-lg text-[#04284B]
      font-semibold hover:bg-[#041527] transition-colors"
    >
      <Link href={`/account/forms/${listId}/list-summary`}>  View Virtual Slip</Link>
    
    </button>

   
    <button
    onClick={() => setIsOpenModal(false)}

      className="h-10 min-w-[300px] px-2 rounded-lg 
      cursor-pointer border bg-transparent active:bg-[#A2B06D] text-gray-400 border-[#04284B]  font-semibold hover:opacity-70 transition-all"
    >
     Continue Shopping
    </button>
   
    
  </div>
    </>
  )}
</div>

    </AccountModal> 
 }

  

  {/* Delete List Modal */}
    {isDeleteModal && <DeleteModal listId={listId} 
    onDelete={handleDelete}
    handleModal={handleModal}
    listname={list_name}
    />}

    {activeItemId && (
  <AddPriceSheet
    itemId={activeItemId}
    listId={listId}
    onClose={() => setActiveItemId(null)}
  />
)}

{itemsLength === 0 || showForm ? <StarterItemsModal
        listId={listId}
        list_name={list_name}
        openform={HandleShowForm}
        itemsLength={itemsLength}
     
      />: ''}



    {itemsLength !== 0 && profile.is_plus !== false &&  (
      <button
      type="button"
      onClick={HandleConfirmPlusForm}
      disabled={isOptimizing}
      className={` ${isOptimizing && 'bg-gray-500'}   bg-[#0B2E1E]
        text-white
       
        rounded-full
        font-semibold
        text-sm
        cursor-pointer
        hover:bg-[#0B2E1E]
        active:scale-95
        transition-all
        disabled:opacity-50
        disabled:cursor-not-allowed
        h-15 w-15 flex justify-center items-center
        right-2 bottom-2
        z-10 fixed active:h-17 active:w-17`
     
      }
    >
      {isOptimizing
        ? "Finding prices..."
        :  <p className='text-2xl'>g
        <span className='-mt-1 text-sm absolute text-[#1EC677]'>+</span></p>}
    </button>

    )}
{GrossaryPlusRun && (
  <GrossaryPlusBunner
    optimizing={isOptimizing}
    results={grossaryPlusResult}
    error={plusError}
    onRetry={handleGrossaryPlus}
    setGrossaryPlusRun={setGrossaryPlusRun}
    GrossaryPlusRun={GrossaryPlusRun}
    listId={listId}
  />
)}



{listitems.length > 0  && (
  <GrossaryTipPopup
    open={activeTip > 0}
    title={currentTip?.title}
    description={currentTip?.description}
    example={currentTip?.example}
    tipNumber={activeTip}
    totalTips={tips.length}
    onNext={handleNextTip}
    onSkip={handleSkipTips}
    nextLabel={
      activeTip === tips.length
        ? savingOnboarding
          ? "Saving..."
          : "Got It!"
        : "Okay, next"
    }
  />
)}
{confirmPlus && <ConfirmPlusModel
grossaryplus={handleGrossaryPlus}
leave={HandleConfirmPlusForm}
isOptimizing={isOptimizing}/>}

    </div>
    
  );
}
