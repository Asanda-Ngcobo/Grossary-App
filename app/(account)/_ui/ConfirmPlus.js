
"use client";



export default function ConfirmPlusModel({
  grossaryplus,
  isOptimizing,
  leave
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center
        bg-black/60 px-4 py-6 backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="grossary-plus-title"
      aria-describedby="grossary-plus-description"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl
          bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="bg-[#0B2E1E] px-6 py-6 text-white">
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center
              rounded-2xl bg-white/10 text-2xl"
            aria-hidden="true"
          >
            🛒
          </div>

          <p className="mb-1 text-sm font-medium text-[#1EC677]">
            A quick note before you continue
          </p>

       
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-5">
          <p
            id="grossary-plus-description"
            className="text-sm leading-6 text-gray-600"
          >
              Are you sure you sure you want to get an optimized savings shopping plan today?
          </p>

          <div
            className="mt-5 flex gap-3 rounded-2xl border
              border-[#1EC677]/30 bg-[#1EC677]/10 p-4"
          >
      

            <p className="text-sm leading-5 text-[#0B2E1E]">
          
           
             Grocery prices and specials change frequently. For the most
            relevant shopping recommendations, we recommend activating
            grossary plus for optimized savings shopping plan on the day you plan to shop.
            </p>
          </div>

          {/* Action */}
          <button
            type="button"
            onClick={grossaryplus}
            disabled={isOptimizing}
            className="mt-6 flex w-full items-center justify-center
              gap-2 rounded-xl bg-[#0B2E1E] px-5 py-4
              font-semibold text-white transition-all duration-200
              hover:bg-[#164b34] active:scale-[0.99]
              disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isOptimizing ? (
              <>
                <span
                  className="h-5 w-5 animate-spin rounded-full
                    border-2 border-white/30 border-t-white"
                  aria-hidden="true"
                />
                Preparing your shopping plan...
              </>
            ) : (
              <>
              Yes
              
              </>
            )}
          </button>
   <button
            type="button"
            onClick={leave}
          
            className="mt-6 flex w-full items-center justify-center
              gap-2 rounded-xl border border-[#0B2E1E] px-5 py-4
              font-semibold text-[#0B2E1E] transition-all duration-200
              hover:bg-[#164b34] active:scale-[0.99]
              disabled:cursor-not-allowed disabled:opacity-60"
          >No</button>
          <p className="mt-3 text-center text-xs text-gray-400">
            Make every grocery trip count.
          </p>
        </div>
      </div>
    </div>
  );
}
