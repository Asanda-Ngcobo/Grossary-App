'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function CheckersScraper() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function scrapeNow() {
    setLoading(true);
    try {
      const res = await fetch('/api/scrape-checkers');

      if (!res.ok) throw new Error('❌ Scraping failed');

      const contentType = res.headers.get('content-type');

      if (contentType.includes('application/json')) {
        const data = await res.json();
        setProducts(data);
        console.log('✅ Scraped JSON:', data);
      } else if (contentType.includes('text/csv')) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'checkers-products.csv';
        link.click();
      } else {
        const text = await res.text();
        console.warn('⚠️ Unknown content type:', text);
      }
    } catch (err) {
      console.error('⚠️ Error in scrapeNow():', err);
    } finally {
      setLoading(false);
    }
  }

  const downloadCSV = async () => {
    try {
      const res = await fetch('/api/scrape-checkers');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'checkers-products.csv';
      link.click();
    } catch (err) {
      console.error('Error downloading CSV:', err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={scrapeNow}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Scraping...' : 'Scrape Checkers'}
        </button>

        {products.length > 0 && (
          <button
            onClick={downloadCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download CSV
          </button>
        )}
      </div>

      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p, idx) => (
            <div key={idx} className="border rounded p-2 shadow">
              <Image
                src={p.image || '/placeholder.png'}
                alt={p.name}
                width={300}
                height={200}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h3 className="font-semibold text-sm">{p.name}</h3>
              <p className="text-green-700 font-medium">{p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
