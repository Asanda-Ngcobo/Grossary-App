'use client';
import { useState, useEffect } from 'react';

export default function ItemSearch({ onItemSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      if (query.length < 3) return;

      const res = await fetch(`app/_lib/api/items/search?q=${query}`);
      const data = await res.json();
      setResults(data);
    };

    const timeout = setTimeout(fetchItems, 300); // debounce
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative">
      <input
        className="w-full border px-3 py-2"
        placeholder="Search items..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <ul className="absolute bg-white border w-full mt-1 z-10 max-h-60 overflow-y-auto">
          {results.map((item) => (
            <li
              key={item.id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onItemSelect(item);
                setQuery('');
                setResults([]);
              }}
            >
              {item.item_name} <span className="text-xs text-gray-500">({item.category})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
