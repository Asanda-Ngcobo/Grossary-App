'use client';

import Link from "next/link";
import Image from "next/image";
import { Quicksand } from "next/font/google";

import SignUpButton from "@/app/(website)/_components/SignUpButton";

import HeroImage from "@/public/old lists.png";
import KeepTrack from "@/public/old lists.png";
import Categories from "@/public/navigate.png";
import Navigate from "@/public/dropdown list.png";

import {
  Circle,
  Navigation,
  ChevronDown,
} from "@deemlol/next-icons";

const HeaderFont = Quicksand({
  subsets: ["latin"],
});

const features = [
  {
    id: 1,
    image: KeepTrack,
    icon: <Circle />,
    heading: "Track Your Spending in Real Time",
    text: "Enter prices as you shop and see exactly how much you're spending before you reach the checkout. Stay within your grocery budget, avoid removing items at the till and shop with confidence.",
  },
  {
    id: 2,
    image: Categories,
    icon: <Navigation />,
    heading: "Navigate the Store Faster",
    text: "Grossary automatically groups your shopping list by supermarket aisle, helping you move through the store efficiently while reducing unnecessary browsing and impulse purchases.",
  },
  {
    id: 3,
    image: Navigate,
    icon: <ChevronDown />,
    heading: "Find Items Instantly",
    text: "Use the category dropdown to jump directly to a specific aisle. Whether you're shopping for fresh produce, dairy or toiletries, the items you need are always easy to find.",
  },
];

export default function ShopSmarterClient() {
  return (
    <>
      {/* Hero */}

      <section className="relative min-h-screen overflow-hidden text-white">

        <Image
          src={HeroImage}
          fill
          priority
          alt="Shopping with Grossary while staying within budget"
          className="object-cover brightness-40"
        />

        <div className="relative z-10 flex items-center min-h-screen">

          <div className="max-w-7xl mx-auto w-[90%]">

            <div className="max-w-2xl">

              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${HeaderFont.className}`}
              >
                Shop Smarter and Stay Within Your Budget
              </h1>

              <p className="mt-6 text-lg lg:text-xl leading-8 text-gray-100">
                Grossary helps you keep track of your grocery spending, organise
                your shopping list by aisle and avoid expensive impulse
                purchases. Spend less time shopping and more time saving.
              </p>

              <div className="mt-10">
                <Link href="/auth/signup">
                  <SignUpButton>
                    <span className="px-8">
                      Start Shopping Smarter
                    </span>
                  </SignUpButton>
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-12">

                <div>
                  <h3 className="text-2xl font-bold">💰</h3>
                  <p>Track every Rand</p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold">🛒</h3>
                  <p>Shop by aisle</p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold">⚡</h3>
                  <p>Faster shopping trips</p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Intro */}

      <section className="py-20">

        <div className="max-w-5xl mx-auto w-[90%] text-center">

          <h2
            className={`text-3xl lg:text-5xl font-bold ${HeaderFont.className}`}
          >
            Take Control of Every Grocery Trip
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-600">
            Grocery shopping should not end with unexpected surprises at the
            checkout. Grossary helps you monitor your spending, organise your
            shopping list and find products faster, making every shopping trip
            easier and more affordable.
          </p>

        </div>

      </section>

      {/* Features */}

      <section className="pb-24">

        <div className="max-w-7xl mx-auto w-[90%] space-y-28">

          {features.map((feature) => (

            <div
              key={feature.id}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                feature.id % 2 === 0 ? "lg:flex-row-reverse" : ""
              }`}
            >

              <div className="lg:w-1/2">

                <Image
                  src={feature.image}
                  alt={feature.heading}
                  className="rounded-3xl shadow-lg w-full"
                />

              </div>

              <div className="lg:w-1/2">

                <div className="flex items-center gap-5">

                  <div className="hidden lg:flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0B2E1E] text-white">
                    {feature.icon}
                  </div>

                  <h2
                    className={`text-3xl font-bold ${HeaderFont.className}`}
                  >
                    {feature.heading}
                  </h2>

                </div>

                <p className="mt-6 text-lg leading-8 text-gray-600">
                  {feature.text}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* Benefits */}

      <section className="bg-gray-50 py-24">

        <div className="max-w-6xl mx-auto w-[90%]">

          <h2
            className={`text-3xl lg:text-5xl text-center font-bold ${HeaderFont.className}`}
          >
            Why Shop with Grossary?
          </h2>

          <p className="text-center text-lg leading-8 text-gray-600 mt-6 max-w-3xl mx-auto">
            Every feature is designed to help you spend less, waste less time
            and enjoy a smoother grocery shopping experience.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

            {[
              "Stay within your grocery budget",
              "Avoid till surprises",
              "Reduce impulse buying",
              "Navigate stores more efficiently",
              "Find products faster",
              "Enjoy stress-free shopping",
            ].map((item) => (

              <div
                key={item}
                className="bg-white rounded-2xl p-8 shadow-sm"
              >

                <div className="text-2xl mb-4">✓</div>

                <p className="text-lg font-medium">
                  {item}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="py-24">

        <div className="max-w-4xl mx-auto w-[90%] text-center">

          <h2
            className={`text-3xl lg:text-5xl font-bold ${HeaderFont.className}`}
          >
            Ready for Stress-Free Grocery Shopping?
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Plan your shopping, track your spending and navigate the store with
            confidence using Grossary.
          </p>

          <div className="mt-10">

            <Link href="/auth/signup">

              <SignUpButton>
                <span className="px-8">
                  Get Started Free
                </span>
              </SignUpButton>

            </Link>

          </div>

        </div>

      </section>
    </>
  );
}