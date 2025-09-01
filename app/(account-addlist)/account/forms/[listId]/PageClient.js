'use client';

import { useEffect, useMemo, useState } from 'react';
import HandleCategories from './add-price/HandleCategories';
import Link from 'next/link';
import { Check, ChevronLeft, Edit, Edit2, Plus, ShoppingCart } from '@deemlol/next-icons';
import DecreaseQuantity from './add-item/DecreaseQuantity';
import DeleteItem from './add-item/DeleteItem';
import IncreaseQuantity from './add-item/IncreaseQuantity';
import FireworksComponent from './FireWorksComponent';
import AccountModal from '@/app/(account)/_ui/AccountModal';
import { Lexend_Deca, Quicksand } from 'next/font/google';


const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

const MoneyFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
});
export default function PageClient({ listId, list_name, list_budget, listitems, groupedItems, profile }) {
 const [selectedCategory, setSelectedCategory] = useState('');
 const [isOpenModal, setIsOpenModal] = useState(false)

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
  const moneySpent =    new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 2,
}).format(money_spent);

  //display money left
  
  const money_left = list_budget - money_spent;
  const moneyLeft =   new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 2,
}).format(money_left);
  const spentPercent = (money_spent / list_budget) * 100;

  const overallShopped = listitems.filter(item => item.is_checked).length;
  const itemsLength = listitems.length;
 
  const toBeShopped = itemsLength - overallShopped;

// Trigger modal only when shopping is completed
useEffect(() => {
  if (overallShopped > 0 && overallShopped === itemsLength) {
    setIsOpenModal(true)
  }
}, [overallShopped, itemsLength])


  const progressColor =
    spentPercent <= 60
      ? "bg-[#A2B06D]"
      : spentPercent <= 90
      ? "bg-amber-500"
      : "bg-[#F38A8C]";


  return (
    <div>
      {/* Header Card */}
      <div className="w-[90%]  mx-[5%] sm:w-[80%] sm:mx-[10%]
       md:w-[80%] md:mx-[10%] lg:w-[60%] lg:mx-[20%] mt-[5%] bg-[#04284B]
       text-white rounded-md shadow-sm px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/account/lists">
            <button className="bg-white cursor-pointer active:bg-gray-600 text-black rounded-full w-10 h-10 flex items-center justify-center">
              <ChevronLeft />
            </button>
          </Link>
          <h1 className="text-xl font-bold text-[#8F8C8C]">{list_name}</h1>
        </div>

        <div className="flex justify-between font-bold">
           <div className='text-[#F38A8C]'  ><p>Money Spent</p>
            <p className={`${MoneyFont.className}
           text-2xl`}>{moneySpent}</p></div>
            <div className={`${money_left  > 0 ? 'text-green-400': 'text-[#E32227]'}`}  >
              <p>Money Left</p> <h1 className={`${MoneyFont.className}
           text-2xl`}>{moneyLeft}</h1></div>

         
        </div>

        <div className="w-full bg-gray-700 rounded-full h-4 my-3">
          <div className={`${progressColor} h-4 rounded-full transition-all 
          duration-500`} style={{ width: `${spentPercent}%` }} />
        </div>

       <div className="flex flex-col items-center justify-center mt-4 space-y-4">
  <div className="text-gray-500">
    <span
      className={`${MoneyFont.className} font-bold text-lg 
      flex flex-row items-center justify-center gap-3`}
    >
      <h5 className="text-center">Budget: {listBudget}</h5>
      <Link href={`/account/forms/${listId}/edit-list`}>
        <Edit2 size={20} color="#A2B06D" />
      </Link>
    </span>
  </div>
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


        <Link href={`/account/forms/${listId}/add-item`} className="bg-[#A2B06D] active:bg-gray-600 w-[40px] h-[40px] rounded-full flex justify-center items-center -mb-8 ml-[90%]">
          <button className="cursor-pointer"><Plus /></button>
        </Link>
      </div>

      {/* Items List */}
      <div className="mt-6 space-y-6">
        {sortedCategoryEntries.map(([category, items]) => {
          const categoryTotal = items.reduce((sum, item) => sum + (item.total_price || 0), 0).toFixed(2);
          const shoppedNumber = items.filter(item => item.is_checked).length;
          const totalNumberOfItems = items.length;
          const itemsLeft = totalNumberOfItems - shoppedNumber;

          return (
            <div key={category} className="bg-[#04284B] text-white w-[90%]  mx-[5%] sm:w-[80%]
             sm:mx-[10%] md:w-[80%] md:mx-[10%] lg:w-[60%] lg:mx-[20%] p-4 rounded-md shadow-sm
            max-h-[550px] overflow-y-auto
">
              <div className="border-b border-gray-300 flex flex-row justify-between">
                <h2 className="text-md font-bold">{category}</h2>
              
                  {itemsLeft === totalNumberOfItems  && <h2>{totalNumberOfItems} items</h2>}
              
                <h2>
                  
                  {!itemsLeft ? 'All Shopped 🎉' : (shoppedNumber > 0 ? `${itemsLeft} of ${totalNumberOfItems} left` : '')}
                </h2>
                <h2 className="text-md font-bold">
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
                      <div className="flex justify-between text-sm font-semibold mb-2">
                        <span>{item.item_quantity} × {item.item_name}</span>
                        <span>{item.item_brand}</span>
                        <span>{item.item_volume_mass}{item.item_unit}</span>
                      </div>
                      <form className="flex items-center gap-4 justify-between">
                        <div className="flex flex-row w-[40%] justify-between">
                            <IncreaseQuantity itemId={item.id}
                          itemName={item.item_name}
                          itemQuantity={item.item_quantity} listId={listId} />
                          
                          <div>
                          
                              
                               <DeleteItem itemId={item.id} listId={listId} />
                            
                          </div>
                          {/* <span className="font-bold text-lg">{item.item_quantity}</span> */}
                        
                        </div>

                        <div>
                          {item.price && <p className="text-sm font-bold text-gray-400">R{item.price}</p>}
                          {item.price && <p className="text-sm font-bold">Total: R{item.total_price}</p>}
                        </div>

                        <Link href={`/account/forms/${listId}/add-price/${item.id}`}>
                          <ShoppingCart className={!item.price ? `text-[#A2B06D] active:text-gray-600`: 'text-gray-500 active:text-[#A2B06D]'} />
                        </Link>
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

  {money_left > 0 ? (
    <>
    
      {/* <FireworksComponent /> */}
      <h1 className="text-2xl font-bold text-green-400 animate-bounce">
        Well Done {capitalizedFirstName}!
      </h1>
      <p className="text-base">
        Your shopping is done and you managed to stay&nbsp;
        <span className="font-bold text-green-300">
          {(money_left / list_budget * 100).toFixed(2)}%
        </span> under budget. 🎉😊
      </p>
       <div className={`${ButtonFont.className} 
   grid gap-6 mt-11 mx-4 `}>
     <button
     
      className="h-10 min-w-[300px] px-2 active:bg-gray-600 bg-[#A2B06D]  cursor-pointer  rounded-lg text-[#04284B]
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
  ) : (
    <>
      <h1 className="text-2xl font-bold text-red-400 animate-bounce">
        Well Done!
      </h1>
      <p className="text-base">
        Your shopping is done. However, you went&nbsp;
        <span className="font-bold text-red-300">
          {(money_left / list_budget * 100 ).toFixed(2)}%
        </span> over budget. 😞
      </p>
       <div className={`${ButtonFont.className} 
   grid gap-6 mt-11 mx-4 `}>
     <button
     
      className="h-10 min-w-[300px] px-2 active:bg-gray-600 bg-[#A2B06D]  cursor-pointer  rounded-lg text-[#04284B]
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

   

    </div>
    
  );
}

