'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { addItem } from '@/app/_lib/actions';
import AddItemButton from '../_listcomponents/AddItemButton';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Quicksand } from 'next/font/google';

const HeadingFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
});
export default function AddItemForm({ listId,setShowForm }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedNumber, setSelectedNumber] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [activeItemId, setActiveItemId] = useState(null);

  const router = useRouter()


 

  async function handleSubmit(formData) {
    startTransition(async () => {
      try {
        const result = await addItem(formData, listId)

        if (result.success) {
            toast.success(<p
            className='text-[#ACF532] text-sm
            '>{query} {selectedNumber}{selectedUnit} 
            <span className='text-white px-2'>added to </span>
             {selectedCategory || 'Uncategorized'}</p>, {
          duration: 8000,
          style: {
            background: '#041527',
            color: '#fff',
          },
          
        });
          
      setShowForm(false);
      router.refresh();
      console.log("Suggestions:", query, selectedNumber, selectedUnit);

         
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
      .ilike('item_name, id', `${query}%`)
      .limit(5);

    if (!error) {
      setSuggestions(data);
   
    }
  };

  fetchSuggestions();
}, [query, supabase]);


const handleSuggestionClick = (item) => {
  setActiveItemId(item.id); // 👈 only show this one
  setQuery(item.item_name ?? '');
  setSelectedCategory(item.item_category ?? 'Uncategorized');
  setSelectedBrand(item.item_brand ?? '');
  setSelectedNumber(item.item_volume_mass ?? '');
  setSelectedUnit(item.item_unit ?? '');
};


  return (
    <main>
    

      <form
      action={handleSubmit}
      >
        {/* Item Name with Autocomplete */}
      <div className="py-2 px-4 rounded-md w-[90%] mt-[2%]
  ml-[5%] md:w-[40%] md:ml-auto lg:w-[40%]
   lg:ml-[30%] grid grid-rows-2 gap-2
   shadow-sm">


         <label htmlFor="name" className={`
         text-2xl text-center ${HeadingFont.className}`}
          >Add Item</label>
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
         
          className="bg-white
           text-black text-2xl p-3
             rounded-2xl w-full
             focus focus:outline-[#ACF532]"
        />
 
  {suggestions.length === 1 && <p className='text-center text-xs
   text-[#ACF532]'>Confirm you want to add 
     this item to your list</p>}
{suggestions.length > 0 && (
  <ul className="absolute bg-white font-bold border text-black
      shadow-xl w-[80%] z-10 rounded mt-[45%] lg:mt-[10%] lg:w-[40%]"
  >
    {suggestions
      .filter(item => activeItemId === null || item.id === activeItemId) // 👈 SHOW ONLY SELECTED
      .map((item, index) => (
        <li
          key={index}
          onClick={() => handleSuggestionClick(item)}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b"
        >
          <div className='flex flex-row justify-between'>
            <div className='flex gap-4'>
              <h1>{item.item_name}</h1>
              <h1>{item.item_brand}</h1>
            </div>
            <div>
              {item.item_volume_mass}{item.item_unit}
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
         <option value="Bag">Bag</option>
      <option value="g">g</option>
      <option value="kg">kg</option>
      <option value="ml">ml</option>
      <option value="L">L</option>
      <option value="Pack">Pack</option>
      <option value="Pair">Pair</option>
       <option value="unit">Unit</option>
          <option value="Set">Set</option>
    
       
    </select>
  </>
)}
 {query && <AddItemButton selectedCategory={selectedCategory}
   
      >Confirm</AddItemButton>}
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
     

      </form>
    </main>
  );
}
