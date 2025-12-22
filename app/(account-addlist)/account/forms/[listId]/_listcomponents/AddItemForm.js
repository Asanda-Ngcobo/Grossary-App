'use client';

import { startTransition, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { addItem } from '@/app/_lib/actions';
import AddItemButton from '../_listcomponents/AddItemButton';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Quicksand } from 'next/font/google';

const HeadingFont = Quicksand({
  subsets: ['latin'],
  display: 'swap',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AddItemForm({ listId, setShowForm }) {
  const router = useRouter();

  /* -------------------- State -------------------- */
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeItemId, setActiveItemId] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedNumber, setSelectedNumber] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');

  /* -------------------- Submit -------------------- */
  async function handleSubmit(formData) {
    startTransition(async () => {
      try {
        const result = await addItem(formData, listId);

        if (result?.success) {
          toast.success(
            <p className="text-sm text-[#ACF532]">
              {query} {selectedNumber}
              {selectedUnit}
              <span className="px-1 text-white">added to</span>
              {selectedCategory || 'Uncategorized'}
            </p>,
            {
              duration: 8000,
              style: { background: '#041527', color: '#fff' },
            }
          );

         
          setQuery('')
         
        }
      } catch {
        toast.error('Something went wrong, check your connection!', {
          duration: 5000,
          style: { background: '#041527', color: '#fff' },
        });
      }
    });
  }

  /* -------------------- Suggestions -------------------- */
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setActiveItemId(null);
      return;
    }

    const fetchSuggestions = async () => {
      const { data } = await supabase
        .from('grocery_items')
        .select('*')
        .ilike('item_name', `${query}%`)
        .limit(5);

      setSuggestions(data ?? []);
    };

    fetchSuggestions();
  }, [query]);

  const handleSuggestionClick = (item) => {
    setActiveItemId(item.id);
    setQuery(item.item_name ?? '');
    setSelectedCategory(item.item_category ?? 'Uncategorized');
    setSelectedBrand(item.item_brand ?? '');
    setSelectedNumber(item.item_volume_mass ?? '');
    setSelectedUnit(item.item_unit ?? '');
  };

  /* -------------------- UI -------------------- */
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form
        action={handleSubmit}
        className="relative w-full max-w-md bg-[#04284B] rounded-2xl p-6 shadow-md space-y-4"
      >
        <h1
          className={`text-2xl text-center text-white ${HeadingFont.className}`}
        >
          Add Item
        </h1>

        {/* Item Name */}
        <div className="relative">
          <input
            name="item_name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Item name"
            required
            className="
              w-full rounded-xl p-3 text-lg text-black
               bg-gray-200
              focus:outline-none focus:ring-2 focus:ring-[#ACF532]
            "
          />

          {suggestions.length > 0 && (
            <ul className="absolute z-10 mt-2 w-full rounded-xl bg-white text-black shadow-lg">
              {suggestions
                .filter(
                  (item) =>
                    activeItemId === null || item.id === activeItemId
                )
                .map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleSuggestionClick(item)}
                    className="px-3 py-2 border-b cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex justify-between">
                      <span>
                        {item.item_name} {item.item_brand}
                      </span>
                      <span className="text-sm">
                        {item.item_volume_mass}
                        {item.item_unit}
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Manual entry if not found */}
        {suggestions.length === 0 && query.length >= 2 && (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="item_volume_mass"
              value={selectedNumber}
              onChange={(e) => setSelectedNumber(e.target.value)}
              placeholder="Size"
              required
              className="rounded-lg p-2"
            />

            <select
              name="item_unit"
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              required
              className="rounded-lg p-2 bg-[#04284B] text-white"
            >
              <option value="">Unit</option>
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="ml">ml</option>
              <option value="L">L</option>
              <option value="Pack">Pack</option>
              <option value="Bag">Bag</option>
              <option value="Unit">Unit</option>
            </select>
          </div>
        )}

        {query && (
          <AddItemButton selectedCategory={selectedCategory}>
            Confirm
          </AddItemButton>
        )}

        {/* Hidden fields */}
        {/* Category (Auto-filled) */} <label htmlFor="name" className=" text-2xl hidden">Item Category</label> <input type="text" name="item_category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className=" hidden" />
       <input type="text" name="item_brand" value={selectedBrand}
        placeholder="Brand"
        className='hidden' onChange={(e) => setSelectedBrand(e.target.value)}  />
        <input type="number" name="item_quantity" placeholder="Quantity"
        className='hidden' defaultValue={1}/>
         <input type="number" name="item_volume_mass" value={selectedNumber} placeholder="Volume/Mass"
         className='hidden' onChange={(e) => setSelectedNumber(e.target.value)}  /> 
        <input type="text" name="item_unit" value={selectedUnit} placeholder="Unit"
        className='hidden' onChange={(e) => setSelectedUnit(e.target.value)}
        />
      </form>
    </main>
  );
}
