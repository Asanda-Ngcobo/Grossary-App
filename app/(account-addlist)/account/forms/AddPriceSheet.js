"use client";

import { useEffect, useRef, useState } from "react";
import { updateItemPrice, getListItemById } from "@/app/_lib/actions";
import { ChevronLeft } from "@deemlol/next-icons";
import { Lexend_Deca } from "next/font/google";


const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});
export default function AddPriceSheet({ itemId, listId, onClose }) {
  /* -------------------- Animation -------------------- */
  const [isVisible, setIsVisible] = useState(false);

  function toPriceInput(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    return null;
  }

  return number.toFixed(2);
}
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "auto";
  }, [isVisible]);

  function handleClose() {
    setIsVisible(false);
    setTimeout(onClose, 300);
  }

  /* -------------------- State -------------------- */
  const [price, setPrice] = useState("");
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const priceInputRef = useRef(null);

  /* -------------------- Fetch Item -------------------- */
  useEffect(() => {
    async function fetchItem() {
      const data = await getListItemById(itemId);
      setItem(data);
    }
    if (itemId) fetchItem();
  }, [itemId]);


    /* -------------------- Prefill price -------------------- */
  useEffect(() => {
    if (!item) return;

    const prefilled =
      toPriceInput(item.loyalty_price) ??
      toPriceInput(item.recommended_price);

    if (prefilled !== null) {
      setPrice(prefilled);
    }
  }, [item]);

  /* -------------------- Autofocus -------------------- */
  /* -------------------- Autofocus -------------------- */
  useEffect(() => {
    if (item && priceInputRef.current) {
      priceInputRef.current.focus();
      priceInputRef.current.select();
    }
  }, [item]);

  /* -------------------- Submit -------------------- */
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
     await updateItemPrice(itemId, listId, parseFloat(price));
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update price");
    } finally {
      setLoading(false);
    }
  }

  if (!item) return null;

  // const promitionalPrice = item.loyalty_price;
  // console.log( 'Price', promitionalPrice)

  /* -------------------- UI -------------------- */
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`
          fixed left-0 bottom-0 w-full z-50
          transition-transform duration-300 ease-in-out
          ${isVisible ? "translate-y-0" : "translate-y-full"}
        `}
        style={{ height: "75vh" }}
      >
        <form
          onSubmit={handleSubmit}
          className="h-full bg-white rounded-t-4xl p-6 flex flex-col shadow-xl"
        >
          {/* Drag Handle */}
          <div className="flex justify-center mb-3">
            <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <button
            type="button"
            onClick={handleClose}
            className="w-10 h-10 text-black"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center items-center text-black">
            <p className="text-center text-lg mb-6">
              {item.item_name} {item.item_brand}
              <br />
              {item.item_volume_mass}
              {item.item_unit}
            </p>
   {item.promotion_message && <p
                                            className="
                                              inline-flex
                                              items-center
                                              mt-2
                                              bg-[#E9FFF4]
                                              text-[#168B55]
                                              text-xs
                                              font-semibold
                                              rounded-full
                                              px-2.5
                                              py-1
                                            "
                                          >
                                            {item.promotion_message}
                                          </p>}
            <div className="flex items-center gap-2">
              <span className="text-2xl">R</span>
              <input
                ref={priceInputRef}
                inputMode="decimal"
                className="text-[80px] font-extrabold outline-none w-[300px]"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value.replace(",", "."))
                }
                required
              />
            </div>
          </div>

          {/* CTA */}
          <button
            type="submit"
            disabled={loading}
            className={`${ButtonFont.className} bg-[#0B2E1E] h-[45px] rounded-lg font-bold text-white text-2xl`}
          >
            
            {loading ? "Saving..." : "Confirm Price"}
          </button>
        </form>
      </div>
    </>
  );
}