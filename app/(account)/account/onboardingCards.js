
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/app/_utils/supabase/client";

import Baby from "@/public/Baby.jpg";
import Toiletries from "@/public/Toiletries.jpg";
import Weekly from "@/public/Weekly Groceries.jpg";
import Monthly from "@/public/Monthly Groceries.jpg";
import Meat from "@/public/Meat.jpg";
import Snacks from "@/public/Snacks.jpg";
import Booze from "@/public/Booze.jpg";
import Restock from "@/public/Restock.jpg";
import Produce from "@/public/Produce.jpg";

const onboardingCards = [
    {
        title: "Weekly groceries",
        image: Weekly,
        emoji: "🗓️",
        description: "Plan your regular weekly grocery shopping.",
    },
    {
        title: "Monthly groceries",
        image: Monthly,
        emoji: "📆",
        description: "Organise your monthly grocery shopping.",
    },
    {
        title: "Restock",
        image: Restock,
        emoji: "🛒",
        description: "Restock the essentials you are running low on.",
    },
    {
        title: "Produce",
        image: Produce,
        emoji: "🥑",
        description: "Shop for fresh fruits, vegetables and salads.",
    },
    {
        title: "Meat",
        image: Meat,
        emoji: "🥩",
        description: "Plan your meat, poultry, seafood and deli shopping.",
    },
    {
        title: "Toiletries",
        image: Toiletries,
        emoji: "🧴",
        description: "Shop for personal care, beauty and household essentials.",
    },
    {
        title: "Baby essentials",
        image: Baby,
        emoji: "🍼",
        description: "Everything your little one needs, from diapers to formula.",
    },
    {
        title: "Snacks",
        image: Snacks,
        emoji: "🍫",
        description: "Stock up on snacks, sweets and your favourite drinks.",
    },
    {
        title: "Booze",
        image: Booze,
        emoji: "🍷",
        description: "Plan your beer, cider, wine and spirits shopping.",
    },
];

const MIN_LOADING_TIME = 5000;

export default function OnboardingCards({ userName }) {
    const router = useRouter();

    const [supabase] = useState(() => createClient());

    const [loadingCard, setLoadingCard] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const isLoading = Boolean(loadingCard);

    async function handleCreateList(card) {
        // Prevent duplicate submissions
        if (isLoading) return;

        const startTime = Date.now();

        try {
            setLoadingCard(card.title);
            setErrorMessage("");

            // =================================
            // 1. CHECK AUTHENTICATION
            // =================================

            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            // Redirect if authentication fails or user is missing
            if (authError || !user) {
                router.replace("/auth/signup");
                return;
            }

            // =================================
            // 2. CREATE GROCERY LIST
            // =================================

            const { data: list, error } = await supabase
                .from("user_lists")
                .insert({
                    user_id: user.id,
                    list_name: card.title,
                })
                .select("id")
                .single();

            if (error) {
                throw error;
            }

            if (!list?.id) {
                throw new Error("Unable to create your grocery list.");
            }

            // =================================
            // 3. MAINTAIN LOADING EXPERIENCE
            // =================================

            const elapsedTime = Date.now() - startTime;

            const remainingTime = Math.max(
                MIN_LOADING_TIME - elapsedTime,
                0
            );

            if (remainingTime > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, remainingTime)
                );
            }

            // =================================
            // 4. NAVIGATE TO CREATED LIST
            // =================================

            router.push(`/account/forms/${list.id}`);

        } catch (error) {
            console.error("List creation error:", error);

            setErrorMessage(
                error?.message ||
                "Something went wrong while creating your list. Please try again."
            );

            setLoadingCard(null);
        }
    }

    // =================================
    // FULL-SCREEN LOADING EXPERIENCE
    // =================================

    if (isLoading) {
        return (
            <div className="
                fixed inset-0 z-50 flex min-h-screen w-full
                items-center justify-center bg-[#F8F8F8] px-6
            ">
                <div className="text-center">

                    <div className="
                        mx-auto mb-6 h-16 w-16 animate-spin
                        rounded-full border-4 border-gray-200
                        border-t-[#ACF532]
                    " />

                    <h1 className="text-3xl font-black text-[#0B2E1E]">
                        Creating Your List...
                    </h1>

                    <p className="mt-3 text-gray-500">
                        We&apos;re getting everything ready for you.
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#1EC677]">
                        {loadingCard}
                    </p>

                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen w-full bg-[#F8F8F8] px-4 py-10 mb-6">

            <div className="mx-auto max-w-5xl">

                {/* Greeting */}
                <div className="flex h-20 w-full items-center">
                    <h1 className="text-2xl font-bold text-[#0B2E1E]">
                        Hello, {userName || "there"}!
                    </h1>
                </div>

                {/* Heading */}
                <div className="mb-10">

                    <h1 className="text-md">
                        What kind of{" "}
                        <span className="text-[#1EC677]">
                            groceries
                        </span>{" "}
                        are we planning to shop?
                    </h1>

                    <p className="mt-3 text-sm text-gray-500">
                        Choose a shopping category to get started.
                    </p>

                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div
                        role="alert"
                        className="
                            mb-6 rounded-xl border border-red-200
                            bg-red-50 p-4 text-sm text-red-700
                        "
                    >
                        {errorMessage}
                    </div>
                )}

                {/* Onboarding Cards */}
                <div className="
                    grid grid-cols-1 gap-5
                    sm:grid-cols-2 xl:grid-cols-3
                ">

                    {onboardingCards.map((card, index) => (

                        <button
                            key={card.title}
                            type="button"
                            onClick={() => handleCreateList(card)}
                            disabled={isLoading}
                            aria-label={`Create a ${card.title} grocery list`}
                            className="
                            cursor-pointer
                                group relative h-[400px] w-full
                                overflow-hidden rounded-3xl
                                bg-[#0B2E1E] text-left text-white
                                shadow-lg transition-all duration-300
                                hover:-translate-y-1 hover:shadow-2xl
                                focus-visible:outline-none
                                focus-visible:ring-4
                                focus-visible:ring-[#0B2E1E]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {/* Background Image */}
                            <Image
                                src={card.image}
                                alt={card.title}
                                fill
                                priority={index === 0}
                                sizes="
                                    (max-width: 640px) 100vw,
                                    (max-width: 1280px) 50vw,
                                    33vw
                                "
                                className="
                                    object-cover
                                    transition-transform duration-700
                                    group-hover:scale-105
                                "
                            />

                            {/* Dark Overlay */}
                            <div className="
                                absolute inset-0
                                bg-gradient-to-t
                                from-black/90 via-black/45 to-black/10
                                transition-opacity duration-300
                                group-hover:from-black/95
                            " />

                            {/* Card Content */}
                            <div className="
                                absolute inset-0 z-10
                                flex flex-col items-center
                                justify-end p-7 pb-9 text-center
                            ">

                                {/* <span
                                    className="mb-4 text-4xl"
                                    aria-hidden="true"
                                >
                                    {card.emoji}
                                </span> */}

                                <h2 className="
                                    text-2xl font-bold
                                    tracking-tight text-white
                                ">
                                    {card.title}
                                </h2>

                                <p className="
                                    mt-3 max-w-[280px]
                                    text-sm leading-relaxed text-white/85
                                ">
                                    {card.description}
                                </p>

                                {/* CTA */}
                                <span className="
                                    mt-7 flex h-12 min-w-44
                                    items-center justify-center
                                    rounded-full border border-white/80
                                    bg-white px-6 text-sm font-bold
                                    text-[#0B2E1E]
                                    transition-all duration-300
                                    group-hover:border-[#0B2E1E]
                                    group-hover:bg-[#0B2E1E]
                                    group-hover:text-white
                                ">
                                    Create list
                                    <span className="ml-2" aria-hidden="true">
                                        →
                                    </span>
                                </span>

                            </div>

                        </button>

                    ))}

                </div>

            </div>

        </main>
    );
}
