"use client";

import { useEffect, useState } from "react";
import SubmitButton from "./SubmitButton";
import { addCard } from "@/app/_lib/actions";
import { ChevronLeft } from "@deemlol/next-icons";

export default function AddCardClient({ toggleForm }) {
  /* -------------------- Animation State -------------------- */
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "auto";
  }, [isVisible]);

  function handleClose() {
    setIsVisible(false);

    setTimeout(() => {
      toggleForm(); // unmount AFTER animation
    }, 300);
  }

  /* -------------------- Submit -------------------- */
  async function handleSubmit(formData) {
    await addCard(formData);
    handleClose();
  }

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
      <main
        className={`
          fixed left-0 bottom-0 w-full z-50
          transition-transform duration-300 ease-in-out
          ${isVisible ? "translate-y-0" : "translate-y-full"}
        `}
        style={{ height: "85vh" }}
      >
        <form
          action={handleSubmit}
          className="
            h-full
            bg-[#F8FAF9]
            rounded-t-4xl
            p-6
            shadow-xl
            flex flex-col
          "
        >
          {/* Drag Handle */}
          <div className="flex justify-center mb-3">
            <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center mb-4">
            <button
              type="button"
              onClick={handleClose}
              className="text-black w-10 h-10"
            >
              <ChevronLeft size={28} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto space-y-5">
            <div>
              <label className="text-lg font-medium text-black">
                Store Name
              </label>
              <input
                name="name"
                type="text"
                required
                autoFocus
                className="w-full rounded-xl bg-gray-200 px-4 py-3 text-lg text-black mt-2"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-black">
                Card Number
              </label>
              <input
                name="card_number"
                type="text"
                inputMode="numeric"
                required
                className="w-full rounded-xl bg-gray-200 px-4 py-3 text-lg text-black mt-2"
              />
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <SubmitButton>Add Card</SubmitButton>
          </div>
        </form>
      </main>
    </>
  );
}