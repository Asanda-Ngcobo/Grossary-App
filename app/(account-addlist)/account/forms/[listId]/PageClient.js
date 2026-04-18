'use client';

import { useEffect, useMemo, useOptimistic, useState } from 'react';
import HandleCategories from './add-price/HandleCategories';
import Link from 'next/link';
import { Check, ChevronLeft, Edit, Edit2, Plus, ShoppingCart } from '@deemlol/next-icons';

import DeleteItem from './_listcomponents/DeleteItem';
import IncreaseQuantity from './_listcomponents/IncreaseQuantity';

import AccountModal from '@/app/(account)/_ui/AccountModal';
import { Lexend_Deca, Quicksand } from 'next/font/google';
import ParentFormBackground from '@/app/(account)/account/ParentFormBackground';
import AddItemForm from './_listcomponents/AddItemForm';
import AddPriceForm from './add-price/[itemId]/AddPriceForm';
import ListMoneyLeft from '@/app/(account)/_ui/ListMoneyLeft';
import ListMoneySpent from '@/app/(account)/_ui/ListMoneySpent';
import Budget from '@/app/(account)/_ui/Budget';

import DeleteModal from "@/app/(account)/account/lists/DeleteModal";
import DeleteList from '@/app/(account)/_ui/DeleteList';
import { deleteList } from '@/app/_lib/actions';
import AddPriceSheet from '../AddPriceSheet';

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

const MoneyFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
});
export default function PageClient({ listId, list_name, 
  list_budget, listitems, groupedItems, profile }) {
 const [selectedCategory, setSelectedCategory] = useState('');
 const [isOpenModal, setIsOpenModal] = useState(false)
 const [showForm, setShowForm] = useState(false)

    function HandleShowForm (){
        setShowForm(def => !def)
    }

      const [isDeleteModal, setIsDeleteModal] = useState(false)
   function handleModal(){
    setIsDeleteModal((isDeleteModal) => !isDeleteModal)
   }

   //Handle Form
   const [activeItemId, setActiveItemId] = useState(null);

function openPrice(id) {
  setActiveItemId(id);
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
  

  //display money left
  
  const money_left = list_budget - money_spent;
 
  const spentPercent = (money_spent / list_budget) * 100;

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


  const progressColor =
    spentPercent <= 60
      ? "bg-[#ACF532]"
           : "bg-[#ACF532]";


  return (
    <div>
      {/* Header Card */}
      <div className="w-[90%]  mx-[5%] sm:w-[80%] sm:mx-[10%]
       md:w-[80%] md:mx-[10%] lg:w-[60%] lg:mx-[20%] mt-[5%] bg-white
       text-black rounded-md shadow-lg px-4 py-4">
        <div className="flex items-center justify-between mb-4">
    
            <button className="bg-white
            cursor-pointer active:bg-gray-600
             text-black rounded-full w-10 h-10
              flex items-center justify-center"
              >
                <Link href={`/account`}>
    <ChevronLeft />
      </Link>
              
            </button>
      
          <h1 className="text-xl font-bold text-[#8F8C8C]">{list_name}</h1>
            {/* Right: Buttons */}
      <div className="flex gap-2 items-center w-1/5">
        {/* <EditList id={id} /> */}
        <DeleteList handleModal={handleModal}/>
      </div>
        </div>

        <div className="flex justify-between font-bold">
           <ListMoneySpent money_spent={money_spent}/>
           {/* <ListMoneyLeft money_left={money_left}/> */}

         
        </div>

        {/* <div className="w-full bg-gray-700 rounded-full h-4 my-3">
          <div className={`${progressColor} h-4 rounded-full transition-all 
          duration-500`} style={{ width: `${spentPercent}%` }} />
        </div> */}

       <div className="flex flex-col items-center justify-center mt-4 space-y-4">
  {/* <div className="text-gray-500">
    <span
      className={`${MoneyFont.className} font-bold text-lg 
      flex flex-row items-center justify-center gap-3`}
    >
    <Budget list_budget={list_budget}/>
      <Link href={`/account/forms/${listId}/edit-list`}>
        <Edit2 size={20} className='text-gray-500' />
      </Link>
    </span>
  </div> */}
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


     
          <button className="bg-[#1EC677]
          text-gray-500 active:bg-gray-600 w-[40px] h-[40px] rounded-full
           flex justify-center items-center -mb-8 ml-[90%] cursor-pointer"
           onClick={HandleShowForm}><Plus /></button>
       
      </div>
      {listitems.length === 0 ? 
      <div className='flex justify-center w-[80%] mx-auto items-center mt-10'>
        <p className=' text-center
bottom-5'>Add Your Grocery list items using the Plus button above</p>

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

                    if (aHasPrice === bHasPrice) {
                      return a.item_name.localeCompare(b.item_name);
                    }
                    return aHasPrice ? 1 : -1;
                  })
                  .map((item) => (
                    <div key={item.id} className="border-b border-gray-300 pb-3">
                      <div className="flex justify-between text-xs font-semibold mb-2">
                        <span>{item.item_quantity} × {item.item_name}</span>
                        <span>{item.item_brand}</span>
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
        border-2 border-[#1EC677]
        flex items-center justify-center
        peer-checked:bg-[#1EC677]
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




                        <div>
                          {item.price && <p className="text-sm font-bold text-gray-400">R{item.price}</p>}
                          {item.price && <p className="text-sm font-bold
                           text-amber-700"> -R{item.total_price}</p>}
                        </div>

                          

                            <div className="flex flex-row w-[40%] gap-4 justify-between">
                            <IncreaseQuantity itemId={item.id}
                          itemName={item.item_name}
                          itemQuantity={item.item_quantity} listId={listId} />
                          
                          <div className='flex w-[200px] justify-between'>
                          
                              
                               <DeleteItem itemId={item.id} listId={listId} />
                                <Link href={`/account/forms/${listId}/edit-item/${item.id}`}>
                          <Edit size={25} className={ `text-gray-500
                             active:text-gray-600`} />
                        </Link>
                            
                          </div>
                          {/* <span className="font-bold text-lg">{item.item_quantity}</span> */}
                        
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
    w-[90%] max-w-lg bg-[#041527] text-white
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
      <h1 className="text-2xl font-bold text-green-400 animate-bounce">
        Well Done {capitalizedFirstName}!
      </h1>
      <p className="text-base">
        Your shopping is done, you can now select the relevant 
        loyalty card and go pay.
      </p>
       <div className={`${ButtonFont.className} 
   grid gap-6 mt-11 mx-4 `}>

        <button
     
      className="h-10 min-w-[300px] px-2 active:bg-gray-600
       bg-amber-700  cursor-pointer  rounded-lg text-[#04284B]
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

    {showForm && (
  <ParentFormBackground 
    openform={HandleShowForm}
    setShowForm={setShowForm}
    listId={listId}
  >
    <AddItemForm  openform={HandleShowForm}
    listId={listId} />
  </ParentFormBackground>
)}

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
    </div>
    
  );
}
