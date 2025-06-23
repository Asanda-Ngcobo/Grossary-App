'use client';

import SignUpButton from "@/app/(website)/_components/SignUpButton";
import Image from "next/image";
import Link from "next/link";
import HeroPic from "@/public/MainPic.jpg";

import AccordionItem from "@/app/(website)/_components/AccordionItem";
import { useState } from "react";

const features = [
  {
    heading: "Smart Store Suggestions",
    description:
      "Get personalized store recommendations based on your exact list, budget, and location—so you shop where it makes the most sense.",
    id: 1,
  },
  {
    heading: "Dynamic Budget Matching",
    description:
      "Grossary Plus calculates your total spend and shows which stores fit your budget in real time.",
    id: 2,
  },
  {
    heading: "Geo-Based Pricing Intelligence",
    description:
      "We analyze location-based pricing trends to help you make smarter, more affordable choices.",
    id: 3,
  },
  {
    heading: "All-in-One Planner",
    description:
      "No more jumping between price comparison apps—Grossary+ handles it all so you can focus on shopping, not searching.",
    id: 4,
  },
];

const data = [
  {
    question: 'Add Your Grocery List',
    explanation: 'Add your grocery items, your budget and save your list.',
    id: 1,
  },
  {
    question: 'Confirm Your Location',
    explanation: 'Confirm your location so we look for relevant stores to you.',
    id: 2,
  },
  {
    question: 'Get Store Recommendations',
    explanation: 'Instantly see the top 3 nearby stores that match your list and budget.',
    id: 3,
  },

];
function GrossaryPlusPage() {
    const [curOpen, setCurOpen] = useState(null);
  return (
    <>
      <main className="p-6 relative my-3">
        <section className="w-[90%] lg:w-[30%] mx-auto text-left my-12 mt-20">
          <h1 className="text-3xl font-bold">Grossary Plus</h1>
          <p className="text-xl ">
            No more flipping through ClicFlyer or chasing random deals.
          </p>
          <p className="text-sm mt-1 text-gray-600">
            Save time, energy, and stay under budget.
          </p>
          <div className="mt-6">
            <Link href="/signup">
              <SignUpButton>
                <span className="px-10">Start Free Trial</span>
              </SignUpButton>
            </Link>
          </div>
        </section>
      </main>

      <section className="relative scroll-mx-0">
  <Image
    src={HeroPic}
    alt="Shopper using Grossary app"
    className="object-cover brightness-50 h-screen w-full"
  />
  <div className="absolute top-0 -mt-14 lg:mt-[20vh] w-full flex justify-center">
    <div className="grid lg:grid-cols-2 gap-10 max-w-5xl px-[5%]">
      {features.map((feature) => (
        <GrossaryPlusFeature key={feature.id} content={feature} />
      ))}
    </div>
  </div>
</section>
<section className="my-7">
    <h1 className="text-3xl font-bold text-center text-gray-900">How It Works Section</h1>
     <div className="max-w-[90%] lg:max-w-[70%] mx-auto my-24 flex flex-col gap-6">
          {data.map((item, index) => (
            <AccordionItem
              key={item.id}
              index={index}
              question={item.question}
              explanation={item.explanation}
              isOpen={curOpen === index}
              onToggle={() => setCurOpen(curOpen === index ? null : index)}
            />
          ))}
          </div>
</section>
<div className="mb-10 lg:w-[60%] lg:ml-[20%] w-[90%] ml-[5%] py-11 ">

        <h2 className="text-2xl font-semibold mb-4">Testimonial Highlight</h2>
        <blockquote className="border-l-4 border-[#A2B06D] pl-4 italic text-gray-700 text-lg">
          “I used to flip through ClicFlyer every week. Now Grossary+ just tells me where to go—and it’s always spot on with prices.
           Love the time and money I save!”
        </blockquote>
        <p className="mt-2 text-sm text-gray-600">— Lerato M., mom of 2 in Pretoria</p>
     
       
        <p className=" pl-4 italic text-gray-700 text-lg mt-[5vh]">
          Get Grossary+ and never overspend again. Your time, money, and energy are too valuable to waste
        </p>
     <div className="mt-6">
            <Link href="/signup">
              <SignUpButton>
                <span className="px-10">Start Free Trial</span>
              </SignUpButton>
            </Link>
          </div>
     
</div>


    </>
  );
}

function GrossaryPlusFeature({ content }) {
  return (
    <div className={`bg-[#04284B] rounded-lg p-6 w-full max-w-[350px] h-[200px] `}>
      <h2 className="text-[#A2B06D] text-xl font-semibold mb-2 text-center">
        {content.heading}
      </h2>
      <p className="text-white text-sm text-left">{content.description}</p>
    </div>
  );
}

export default GrossaryPlusPage;
