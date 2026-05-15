

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/_utils/supabase/client";

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
    title: "Custom list",
    emoji: "✍️",
    description: "Create list with your custom name",
    custom: true,
  },
];

export default function OnboardingCards({userName}) {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(null);

  async function handleCreateList(card) {
    try {
      setLoading(card.title);

      // Redirect custom list
      if (card.custom) {
        router.push("/account/lists/create");
        return;
      }

      // Get logged in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Create list
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

      // Optional:
      // Insert starter items here later

      // Redirect to list
      router.push(`/account/forms/${list.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
         <div className="w-full h-20 flex justify-left items-center
             font-bold">
            <div className="lg:flex text-2xl">
              <h1 >Hello, {userName}</h1>
            </div>
          </div>
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
          {onboardingCards.map((card) => (
            <button
              key={card.title}
              onClick={() => handleCreateList(card)}
              disabled={loading !== null}
              className="bg-white rounded-3xl p-6 text-left border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
            >
              <div className="text-5xl mb-5">{card.emoji}</div>

              <h2 className="font-bold text-2xl text-[#0B2E1E]">
                {card.title}
              </h2>

              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                {card.description}
              </p>

              <div className="mt-6">
                <span className="text-sm font-semibold text-[#ACF532]">
                  {loading === card.title
                    ? "Creating..."
                    : card.custom
                    ? "Create custom"
                    : "Create List →"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}