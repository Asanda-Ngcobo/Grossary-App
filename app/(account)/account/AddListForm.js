"use client";

import { useEffect, useState } from "react";
import { createList } from "@/app/_lib/actions";
import SubmitButton from "./SubmitButton";
import { ChevronLeft } from "@deemlol/next-icons";

export default function AddListForm({ toggleForm }) {
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
        style={{ height: "90vh" }}
      >
        <form
          action={createList}
          className="
            h-full
            bg-[#e7eeea]
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
          <div className="flex-1 overflow-y-auto space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="list_name"
                className="text-lg font-medium text-black"
              >
                List Name
              </label>

              <input
                id="list_name"
                name="list_name"
                type="text"
                required
                placeholder="e.g. Monthly groceries"
                className="
                  w-full
                  bg-transparent
                  px-1 py-2
                  text-2xl font-extrabold text-black
                  outline-none
                "
              />
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <SubmitButton>Create List</SubmitButton>
          </div>
        </form>
      </main>
    </>
  );
}