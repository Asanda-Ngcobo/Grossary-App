'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { addItem } from '@/app/_lib/actions';
import { ChevronLeft } from '@deemlol/next-icons';
import Link from 'next/link';
import AddItemButton from './AddItemButton';

export default function AddItemForm({ listId }) {
  const formRef = useRef(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedNumber, setSelectedNumber] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
const [hasSearched, setHasSearched] = useState(false);

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
      setHasSearched(false);
      return;
    }

    const { data, error } = await supabase
      .from('grocery_items')
      .select('*')
      .ilike('item_name', `${query}%`)
      .limit(5);

    if (!error) {
      setSuggestions(data);
      setHasSearched(true); // mark search complete
    }
  };

  fetchSuggestions();
}, [query, supabase]);


 const handleSuggestionClick = (item) => {
  setQuery(item.item_name ?? '');
  setSelectedCategory(item.item_category ?? '');
  setSelectedBrand(item.item_brand ?? '');
  setSelectedNumber(item.item_volume_mass ?? '');
  setSelectedUnit(item.item_unit ?? '');
  setSuggestions([]);
};


  return (
    <main>
      <button className="my-5 mx-[5%] bg-white rounded-full w-[50px] h-[50px] flex justify-center items-center">
        <Link href={`/account/forms/${listId}`}>
          <ChevronLeft color="black" size={40} />
        </Link>
      </button>

      <form
        ref={formRef}
        action={async (formData) => {
          await addItem(formData, listId);
        }}
      >
        {/* Item Name with Autocomplete */}
      <div className="py-2 px-4 rounded-md w-[90%] mt-[2%]
  ml-[5%] md:w-[40%] md:ml-[25%] grid grid-rows-2 gap-2 bg-[#041527]
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
 {query.length > 2 && hasSearched && suggestions.length === 0 && (
  <div className='absolute top-[30%] bg-red-500 text-white text-center rounded-md p-3 w-[80%] md:w-[40%]'>
    😞 Item not found. Please try a different name.
  </div>
)}


       {suggestions.length > 0 && (
          <ul className="absolute bg-[#041527] border text-white
           shadow-xl  w-[80%]  z-10 rounded
           mt-[32%] overflow-y-auto lg:mt-[20%] lg:w-[40%]

            ">
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(item)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
               
                       <div className='flex flex-row justify-between text-[##041527]'>
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
     
        {/* Category (Auto-filled) */}
       <label htmlFor="name" className=" text-2xl hidden">Item Category</label>
      <input
        type="text"
        name="item_category"
        value={selectedCategory}
       
        onChange={(e) => setSelectedCategory(e.target.value)}
        required
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
      {query && <AddItemButton>Add Item</AddItemButton>}

      </form>
    </main>
  );
}
