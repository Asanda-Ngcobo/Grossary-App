
'use client';

import { Quicksand } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

import SignUpButton from "@/app/(website)/_components/SignUpButton";

import HeroImage from "@/public/List.png";
import AddItems from "@/public/add items.png";
import ReuseLists from "@/public/reuse lists.png";
import BudgetImage from "@/public/budgeting.jpg"; // Replace with your image

import { Plus, RotateCcw, Watch } from "@deemlol/next-icons";

const headerFont = Quicksand({
  subsets: ["latin"],
});

const features = [
  {
    id: 1,
    image: AddItems,
    icon: <Plus />,
    heading: "Never Forget an Item Again",
    text: "Shopping ideas come to you throughout the day. Add groceries the moment you remember them—whether you're at work, home, on campus or on the go. Your shopping list is always up to date, so nothing gets left behind.",
  },
  {
    id: 2,
    image: ReuseLists,
    icon: <RotateCcw />,
    heading: "Reuse Your Monthly Grocery Lists",
    text: "Most households buy many of the same groceries every month. Instead of creating a new shopping list from scratch, reuse a previous list with a single tap and simply update the items you need.",
  },
  {
    id: 3,
    image: BudgetImage,
    icon: <Watch />,
    heading: "Plan Before You Spend",
    text: "Creating your shopping list before heading to the store helps reduce impulse purchases, keeps you organised and makes sticking to your grocery budget much easier.",
  },
];

export default function PlanAheadClient() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen overflow-hidden text-white">
        <Image
          src={HeroImage}
          fill
          priority
          alt="Planning a grocery shopping list"
          className="object-cover brightness-40"
        />

        <div className="relative z-10 flex items-center min-h-screen">
          <div className="max-w-7xl mx-auto w-[90%]">
            <div className="max-w-2xl">
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${headerFont.className}`}
              >
                Plan Your Grocery Shopping Before You Leave Home
              </h1>

              <p className="mt-6 text-lg lg:text-xl leading-8 text-gray-100">
                Grossary helps you create smart grocery shopping lists, remember
                every item, reuse monthly lists and stay within your budget.
                Whether you`re shopping for the week or the month, everything
                you need is organised in one place.
              </p>

              <div className="mt-10">
                <Link href="/auth/signup">
                  <SignUpButton>
                    <span className="px-8">
                      Create Your First Shopping List
                    </span>
                  </SignUpButton>
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                <div>
                  <h3 className="text-2xl font-bold">✓</h3>
                  <p className="text-white/90">
                    Never forget groceries
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold">🛒</h3>
                  <p className="text-white/90">
                    Reusable shopping lists
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold">💰</h3>
                  <p className="text-white/90">
                    Shop within budget
                  </p>
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
            className={`text-3xl lg:text-5xl font-bold ${headerFont.className}`}
          >
            A Smarter Way to Plan Your Groceries
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-600">
            Grossary is a free grocery shopping list app designed to help South
            Africans organise their shopping before leaving home. Create
            reusable grocery lists, remember every item and make every shopping
            trip faster, easier and more affordable.
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
                    className={`text-3xl font-bold ${headerFont.className}`}
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
            className={`text-3xl lg:text-5xl text-center font-bold ${headerFont.className}`}
          >
            Why Plan Your Shopping?
          </h2>

          <p className="text-center text-lg leading-8 text-gray-600 mt-6 max-w-3xl mx-auto">
            Planning your grocery shopping helps you save money, reduce impulse
            purchases and avoid making extra trips to the supermarket because
            you forgot something.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[
              "Spend less on groceries",
              "Avoid impulse purchases",
              "Never forget essentials",
              "Reuse shopping lists every month",
              "Stay organised",
              "Save time in the supermarket",
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
            className={`text-3xl lg:text-5xl font-bold ${headerFont.className}`}
          >
            Ready to Shop Smarter?
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Create your first grocery shopping list today and discover an easier
            way to plan your weekly and monthly shopping.
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

