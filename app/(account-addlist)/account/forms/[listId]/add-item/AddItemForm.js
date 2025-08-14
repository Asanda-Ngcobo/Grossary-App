'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { addItem } from '@/app/_lib/actions';
import { ChevronLeft } from '@deemlol/next-icons';
import Link from 'next/link';
import AddItemButton from './AddItemButton';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AddItemForm({ listId }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedNumber, setSelectedNumber] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const router = useRouter()
 

  async function handleSubmit(formData) {
    startTransition(async () => {
      try {
        const result = await addItem(formData, listId)

        if (result.success) {
            toast.success(<p>Item added to <span className='font-bold
               text-green-400 '>{selectedCategory || 'Uncategorized'}</span></p>, {
          duration: 5000,
          style: {
            background: '#041527',
            color: '#fff',
          },
        });
          
          // ✅ Wait before redirect
          setTimeout(() => {
            router.push(`/account/forms/${listId}`)
          }, 2000)
        }
      } catch (error) {
        toast.error('Something went wrong, check your connection!',
           {
          duration: 5000,
          style: {
            background: '#041527',
            color: '#fff',
          },
        }
        )
      }
    })
  }
  const [supabase] = useState(() =>
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  );

  useEffect(() => {
  const fetchSuggestions = async () => {
    if (query.length < 2) {
      setSuggestions([]);
   
      return;
    }

    const { data, error } = await supabase
      .from('grocery_items')
      .select('*')
      .ilike('item_name', `${query}%`)
      .limit(5);

    if (!error) {
      setSuggestions(data);
   
    }
  };

  fetchSuggestions();
}, [query, supabase]);


 const handleSuggestionClick = (item) => {
  setQuery(item.item_name ?? '');
  setSelectedCategory(item.item_category ?? 'Uncategorized');
  setSelectedBrand(item.item_brand ?? '');
  setSelectedNumber(item.item_volume_mass ?? '');
  setSelectedUnit(item.item_unit ?? '');
  setSuggestions([]);
};


  return (
    <main>
      <button className="my-5 mx-[5%] bg-white active:bg-gray-600 rounded-full w-[50px] h-[50px] flex justify-center items-center">
        <Link href={`/account/forms/${listId}`}>
          <ChevronLeft color="black" size={40} />
        </Link>
      </button>

      <form
      action={handleSubmit}
      >
        {/* Item Name with Autocomplete */}
      <div className="py-2 px-4 rounded-md w-[90%] mt-[2%]
  ml-[5%] md:w-[40%] md:ml-[25%] lg:w-[40%] lg:ml-[30%] grid grid-rows-2 gap-2 bg-[#041527]
   shadow-sm">


         <label htmlFor="name" className=" text-2xl text-center">Add Item</label>
        <input
          type="text"
          name="item_name"
          placeholder="Item Name"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          required
          autoComplete="on"
          className="bg-white text-black text-2xl p-3  rounded-4xl w-full"
        />
 


       {suggestions.length > 0 && (
          <ul className="absolute bg-[#041527] border text-white
           shadow-xl  w-[80%]  z-10 rounded
           mt-[35%]  overflow-y-auto lg:mt-[15%] lg:w-[40%]

            ">
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(item)}
                className="px-3 py-2 hover:bg-gray-100 hover:text-[#041527] cursor-pointer"
              >
               
                       <div className='flex flex-row justify-between '>
                    <div className='flex gap-4'>
                 <h1>{item.item_name}</h1>
                 <h1>{item.item_brand}</h1>
                    </div>
                

                 <div>
                 {item.item_volume_mass}
                 {item.item_unit}
                 
                </div>
                </div>
               
             
                 
                
              </li>
            ))}
          </ul>
        )}
     
     {suggestions.length === 0 && query.length >= 2 && (
  <>
    <input
      type="number"
      name="item_volume_mass"
      value={selectedNumber}
      placeholder="Volume/Mass"
      onChange={(e) => setSelectedNumber(e.target.value)}
      className="w-full border px-3 py-2 rounded"
      required
    />

    <select
      name="item_unit"
      value={selectedUnit}
      onChange={(e) => setSelectedUnit(e.target.value)}
      className="w-full border px-3 py-2 rounded bg-[#04284B]"
      required
    >
      <option value="">Select Unit</option>
      <option value="kg">kg</option>
      <option value="g">g</option>
      <option value="ml">ml</option>
      <option value="L">L</option>
      <option value="Pack">Pack</option>
       <option value="unit">Unit</option>
       <option value="unit">bag</option>
       
    </select>
  </>
)}
        {/* Category (Auto-filled) */}
       <label htmlFor="name" className=" text-2xl hidden">Item Category</label>
      <input
        type="text"
        name="item_category"
        value={selectedCategory}
       
        onChange={(e) => setSelectedCategory(e.target.value)}
        
        className="bg-white text-gray-300 text-2xl p-3 rounded-md w-full hidden"
      />
      </div>

      

      <input
        type="text"
        name="item_brand"
         value={selectedBrand}
        placeholder="Brand"
          onChange={(e) => setSelectedBrand(e.target.value)}
        className="w-full border px-3 py-2 rounded hidden"
      />

      <input
        type="number"
        name="item_quantity"
        placeholder="Quantity"
        defaultValue={1}
        className="w-full border px-3 py-2 rounded hidden"
      />

      <input
        type="number"
        name="item_volume_mass"
          value={selectedNumber}
        placeholder="Volume/Mass"
          onChange={(e) => setSelectedNumber(e.target.value)}
        className="w-full border px-3 py-2 rounded hidden"
      />

      <input
        type="text"
        name="item_unit"
         value={selectedUnit}
        placeholder="Unit"
          onChange={(e) => setSelectedUnit(e.target.value)}
        className="w-full border px-3 py-2 rounded hidden"
      />
      {query && <AddItemButton selectedCategory={selectedCategory}
      >Add Item</AddItemButton>}

      </form>
    </main>
  );
}
