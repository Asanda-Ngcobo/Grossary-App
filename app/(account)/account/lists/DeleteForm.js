'use client';

import { useId, useState, useTransition } from "react";
import { Lexend_Deca } from "next/font/google";
import SpinnerMini from "@/app/(website)/_components/SpinnerMini";

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

function DeleteForm({ listId, onDelete, listname, handleModal }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const titleId = useId();
  const descriptionId = useId();

  function handleDelete() {
    if (isPending) return;
    setError(null);

    startTransition(async () => {
      try {
        await onDelete(listId);
      } catch (err) {
        console.error("Failed to delete list:", err);
        setError("Something went wrong and the list wasn't deleted. Please try again.");
      }
    });
  }

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="
        z-50 mx-auto mt-[40%] w-[90%] min-h-[40%]
        md:mt-[20%] md:w-[50%] lg:w-[35%]
        flex flex-col justify-between gap-6
        rounded-2xl bg-[#0B2E1E] p-6 text-white shadow-2xl
      "
    >
      {/* Confirmation text */}
      <div className="text-center">
        <h2 id={titleId} className="mb-2 text-2xl font-semibold">
          Delete this list?
        </h2>

        <p id={descriptionId} className="text-base text-white/80">
          <span className="block break-words text-lg font-medium text-white">
            {listname}
          </span>
          This can&apos;t be undone.
        </p>

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className={`${ButtonFont.className} flex justify-center gap-4`}>
        <button
          type="button"
          autoFocus
          onClick={handleModal}
          disabled={isPending}
          className="
            h-11 w-32 rounded-lg border border-white bg-white text-black
            cursor-pointer transition
            hover:bg-gray-200
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-white
            disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          aria-busy={isPending}
          className="
            flex h-11 w-32 items-center justify-center rounded-lg
            bg-red-600 font-semibold text-white
            cursor-pointer transition
            hover:bg-red-700 active:scale-[0.98]
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-white
            disabled:cursor-not-allowed disabled:opacity-60
            disabled:hover:bg-red-600 disabled:active:scale-100
          "
        >
          {isPending ? (
            <>
              <SpinnerMini />
              <span className="sr-only">Deleting list, please wait</span>
            </>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  );
}

export default DeleteForm;