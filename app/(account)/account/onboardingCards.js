"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/_utils/supabase/client";
import { useForm } from "@/app/providers/Provider";

const onboardingCards = [
  {
    title: "Weekly groceries",
    emoji: "🧺",
    description: "Your regular weekly grocery shopping",
  },
  {
    title: "Monthly groceries",
    emoji: "🛒",
    description: "Your regular monthly grocery shopping",
  },
  {
    title: "Meat",
    emoji: "🥩",
    description: "Meat Products",
  },
  {
    title: "Toiletries",
    emoji: "🧴",
    description: "Personal Care Products",
  },
  {
    title: "Restock",
    emoji: "📜",
    description: "Groceries restock",
  },
  {
    title: "Baby essentials",
    emoji: "🍼",
    description: "Diapers, formula, wipes and more",
  },
   {
    title: "Snacks",
    emoji: "🍫",
    description: "Chips, sweets, drinks and more",
  },
   {
    title: "Booze",
    emoji: "🍷",
    description: "Beer, Cider, wine, spirits and more",
  },
  // {
  //   title: "Custom list",
  //   emoji: "✍️",
  //   description: "Create list with your custom name",
  //   custom: true,
  // },
];

export default function OnboardingCards({ userName }) {
  const supabase = createClient();
  const router = useRouter();
  

  const [loadingCard, setLoadingCard] = useState(null);

  async function handleCreateList(card) {
    // prevent double clicks
    if (loadingCard) return;

  

    // -----------------------------
    // SYSTEM LIST FLOW (DB CALL)
    // -----------------------------
    try {
      setLoadingCard(card.title);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: list, error } = await supabase
        .from("user_lists")
        .insert({
          user_id: user.id,
          list_name: card.title,
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        alert("Failed to create list");
        return;
      }

      router.push(`/account/forms/${list.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCard(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Greeting */}
        <div className="w-full h-20 flex items-center font-bold">
          <h1 className="text-2xl">
            Hello, {userName}
          </h1>
        </div>

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-black">
            What kind of shopping are we planning to do?
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Choose from the options below.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {onboardingCards.map((card) => {
            const isLoading = loadingCard === card.title;

            return (
              <button
                key={card.title}
                onClick={() => handleCreateList(card)}
                disabled={!!loadingCard && !card.custom}
                className={`
                  bg-white rounded-3xl p-6 text-left border
                  transition-all duration-200 active:scale-[0.98]
                  hover:shadow-xl hover:border-black
                  border-gray-200

                 cursor-pointer

                  ${
                    loadingCard && !card.custom
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }
                `}
              >
                <div className="text-5xl mb-5">
                  {card.emoji}
                </div>

                <h2 className="font-bold text-2xl text-[#0B2E1E]">
                  {card.title}
                </h2>

                <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                  {card.description}
                </p>

                <div className="mt-6">
                  <span className="text-sm font-semibold text-[#ACF532]">
                    {isLoading
                      ? "Creating..."
                      : card.custom
                      ? "Create custom →"
                      : "Create list →"}
                  </span>
                </div>
              </button>
             
            );
          })}

           {/* <button onClick={toggleForm}>
            <div className="  bg-white rounded-3xl p-6 text-left border
                  transition-all duration-200 active:scale-[0.98]
                  hover:shadow-xl hover:border-black
                  border-dashed border-gray-400"
                  >

                      <div className="text-5xl mb-5">
                  ✍️
                </div>

                <h2 className="font-bold text-2xl text-[#0B2E1E]">
                 Custom list
                </h2>

                <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Create list with your custom name
                </p>

                <div className="mt-6">
                  <span className="text-sm font-semibold text-[#ACF532]">
                    
                     Create custom 
                     
                  </span>
                </div>   

                  </div>
           </button> */}
        </div>
      </div>

      {/* Custom List Modal */}
      {/* {formOpen && (
        <ParentFormBackground openform={toggleForm}>
          <AddListForm toggleForm={toggleForm} />
        </ParentFormBackground>
      )} */}
    </main>
  );
}