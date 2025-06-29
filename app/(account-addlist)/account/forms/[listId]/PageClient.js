'use client';

import { useEffect, useMemo, useState } from 'react';
import HandleCategories from './add-price/HandleCategories';
import Link from 'next/link';
import { ChevronLeft, Edit, Plus, ShoppingCart } from '@deemlol/next-icons';
import DecreaseQuantity from './add-item/DecreaseQuantity';
import DeleteItem from './add-item/DeleteItem';
import IncreaseQuantity from './add-item/IncreaseQuantity';
import FireworksComponent from './FireWorksComponent';



export default function PageClient({ listId, list_name, list_budget, listitems, groupedItems }) {
 const [selectedCategory, setSelectedCategory] = useState('');

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

// useEffect(() => {
//   return () => {
//     localStorage.removeItem('selectedCategory');
//   };
// }, [listId]);

  const moneySpent = listitems.reduce((acc, item) => acc + (item.total_price || 0), 0);
  //display money spent
  
  const moneyLeft = list_budget - moneySpent;
  const spentPercent = (moneySpent / list_budget) * 100;

  const overallShopped = listitems.filter(item => item.is_checked).length;
  const itemsLength = listitems.length;
 
  const toBeShopped = itemsLength - overallShopped;


  const progressColor =
    spentPercent <= 60
      ? "bg-[#A2B06D]"
      : spentPercent <= 90
      ? "bg-amber-500"
      : "bg-[#F38A8C]";


  return (
    <div>
      {/* Header Card */}
      <div className="w-[90%]  mx-[5%] sm:w-[80%] sm:mx-[10%] md:w-[80%] md:mx-[10%] lg:w-[60%] lg:mx-[20%] mt-[5%] bg-[#04284B]
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
           <p className=' text-[#F38A8C]'>Money Spent<br />R{moneySpent.toFixed(2)}</p>
          <p className={`${moneyLeft  > 0 ? 'text-green-400': 'text-[#E32227]'}`}>Money Left<br />R{moneyLeft.toFixed(2)}</p>
         
        </div>

        <div className="w-full bg-gray-700 rounded-full h-4 my-3">
          <div className={`${progressColor} h-4 rounded-full transition-all duration-500`} style={{ width: `${spentPercent}%` }} />
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-gray-50">
            Budget: <br />
            <span className="font-bold text-lg flex flex-row gap-3"><h5>R{list_budget}</h5>
            <Link href={`/account/forms/${listId}/edit-list`}><Edit size={20} color='#A2B06D'/></Link></span>
          </div>

          <HandleCategories
            allItems={Object.values(groupedItems).flat()}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortedCategoryEntries={sortedCategoryEntries}
          />
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
                        <div className="flex flex-row w-[30%] justify-between">
                          <div>
                            {item.item_quantity > 1
                              ? <DecreaseQuantity itemId={item.id} listId={listId} />
                              : <DeleteItem itemId={item.id} listId={listId} />
                            }
                          </div>
                          <span className="font-bold text-lg">{item.item_quantity}</span>
                          <IncreaseQuantity itemId={item.id} listId={listId} />
                        </div>

                        <div>
                          {item.price && <p className="text-sm font-bold text-gray-400">R{item.price}</p>}
                          {item.price && <p className="text-sm font-bold">Total: R{item.total_price}</p>}
                        </div>

                        <Link href={`/account/forms/${listId}/add-price/${item.id}`}>
                          <ShoppingCart className={!item.price ? `text-[#A2B06D]`: 'text-gray-500'} />
                        </Link>
                      </form>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
     {overallShopped > 0 && overallShopped === itemsLength  && <div className=' 
     rounded-2xl
      w-[90%] h-[500px] mx-[5%]  shadow-white md:w-[40%] md:mx-[30%]
     flex  justify-center items-center bg-[#04284B]
 
      fixed bottom-1 left-0 z-20 shadow-sm
      text-3xl text-center'
      >
        
 {moneyLeft > 0 ? <div className='mx-3 py-4'>
  <h1 className='font-bold'>Congratulations!</h1>
  <p>  Your shopping is done and you managed
   to stay <span className=' text-green-400 font-extrabold'>
    {(moneyLeft / list_budget * 100).toFixed(2)}% </span> under budget
   . 😊🎉</p>
 </div>: 
   <div>  <h1 className='font-bold'>Congratulations!</h1>
   <p>Your shopping is done. However, 
  you went <span className='text-[#E32227]'>{(moneyLeft / list_budget * 100 * -1).toFixed(2)}%</span> over budget 😞</p>
  </div>
  }



</div> }
{overallShopped > 0 && overallShopped === itemsLength && <FireworksComponent/> }
   

    </div>
    
  );
}

