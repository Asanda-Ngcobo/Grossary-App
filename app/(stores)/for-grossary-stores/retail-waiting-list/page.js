// app/retailer-waitlist/page.tsx
'use client';

import { useState } from 'react';

export default function RetailerWaitlistPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // You would normally send the form data to Supabase or another API here
    setSubmitted(true);
  };

  return (
    <main className="max-w-2xl mx-auto p-6 relative -z-10 my-3">
      <h1 className="text-3xl font-bold mb-4 text-center mt-20">Join the Grossary Retail Network</h1>
      <p className="text-gray-600 mb-6 text-center">
        Boost your store’s visibility by reaching shoppers looking to save time and money.  
        We help customers discover where to buy based on budget, location, and product availability.
      </p>

      {submitted ? (
        <div className="bg-green-100 p-6 rounded text-[#A2B06D] text-center">
          ✅ Thanks for joining the Grossary Retail Network. We’ll be in touch shortly!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-6 ">
          <div>
            <label className="block font-semibold">Store Name *</label>
            <input required type="text" className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block font-semibold">Contact Person *</label>
            <input required type="text" className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block font-semibold">Email Address *</label>
            <input required type="email" className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block font-semibold">Phone Number</label>
            <input type="tel" className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block font-semibold">Store Address</label>
            <input type="text" className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block font-semibold">Why do you want to join Grossary?</label>
            <textarea className="w-full border px-3 py-2 rounded" rows={3}></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[#A2B06D] text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Join the Network
          </button>
        </form>
      )}
    </main>
  );
}
