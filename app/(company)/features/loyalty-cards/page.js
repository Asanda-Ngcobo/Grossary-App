'use client';

import { Quicksand } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

import SignUpButton from "@/app/(website)/_components/SignUpButton";

import HeroImage from "@/public/loyalty-hero.png";
import StoreCards from "@/public/store-loyalty-cards.jpg";
import Rewards from "@/public/loyalty-rewards.jpg";
import Checkout from "@/public/checkout-scan.jpg";

import {
  CreditCard,
  Gift,
  Folder,
  Cpu,
} from "@deemlol/next-icons";

const HeaderFont = Quicksand({
  subsets: ["latin"],
});

const features = [
  {
    id: 1,
    image: StoreCards,
    icon: <CreditCard />,
    heading: "Store Your Loyalty Cards Digitally",
    text: `Keep all your grocery loyalty cards in one place. Add cards from Checkers, Shoprite, Pick n Pay, Woolworths, SPAR, Clicks and Dis-Chem so they're always available whenever you shop.`,
  },
  {
    id: 2,
    image: Rewards,
    icon: <Gift />,
    heading: "Never Miss Rewards Again",
    text: `Forgetting your loyalty card can mean losing valuable discounts and reward points. With Grossary, your digital loyalty cards are always on your phone, helping you earn every reward available.`,
  },
  {
    id: 3,
    image: Checkout,
    icon: <Cpu />,
    heading: "Scan in Seconds at Checkout",
    text: `Simply open Grossary, select your loyalty card and let the cashier scan the barcode. No more digging through your wallet or carrying multiple plastic cards.`,
  },
];

export default function LoyaltyCardsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-screen overflow-hidden text-white">
        <Image
          src={HeroImage}
          fill
          priority
          alt="Digital grocery loyalty cards stored on a smartphone"
          className="object-cover brightness-40"
        />

        <div className="relative z-10 flex h-full items-center">
          <div className="w-[90%] max-w-6xl mx-auto">
            <div className="max-w-xl">
              <h1
                className={`text-4xl lg:text-6xl font-bold mb-6 ${HeaderFont.className}`}
              >
                Keep All Your Loyalty Cards in One Place
              </h1>

              <p className="text-lg lg:text-xl text-gray-100 leading-8">
                Stop missing out on discounts because you forgot your loyalty
                card. Store all your grocery reward cards securely in Grossary
                and access them anytime you shop.
              </p>

              <div className="mt-10">
                <Link href="/auth/signup">
                  <SignUpButton>
                    <span className="px-10">
                      Store Your First Card
                    </span>
                  </SignUpButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="w-[90%] max-w-6xl mx-auto space-y-24">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`flex flex-col lg:flex-row ${
                feature.id % 2 === 0 ? "lg:flex-row-reverse" : ""
              } gap-12 items-center`}
            >
              <div className="lg:w-1/2">
                <Image
                  src={feature.image}
                  alt={feature.heading}
                  className="rounded-3xl shadow-lg"
                />
              </div>

              <div className="lg:w-1/2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#0B2E1E] text-white flex items-center justify-center">
                    {feature.icon}
                  </div>

                  <h2
                    className={`text-3xl font-bold ${HeaderFont.className}`}
                  >
                    {feature.heading}
                  </h2>
                </div>

                <p className="text-lg leading-8 text-gray-600">
                  {feature.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 py-24">
        <div className="w-[90%] max-w-5xl mx-auto text-center">
          <h2
            className={`text-4xl font-bold mb-8 ${HeaderFont.className}`}
          >
            Why Store Loyalty Cards Digitally?
          </h2>

          <p className="text-lg text-gray-600 leading-8 max-w-3xl mx-auto">
            Plastic loyalty cards are easy to lose, easy to forget and take up
            unnecessary space in your wallet. Grossary keeps all your loyalty
            cards organised in one secure place so you can earn rewards,
            receive member discounts and enjoy a faster checkout every time you
            shop.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <Folder className="mb-4" />
              <h3 className="font-semibold text-xl mb-3">
                One Digital Wallet
              </h3>
              <p className="text-gray-600">
                Keep all your grocery loyalty cards together in one place.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <Gift className="mb-4" />
              <h3 className="font-semibold text-xl mb-3">
                Earn Every Reward
              </h3>
              <p className="text-gray-600">
                Never miss discounts, cashback or loyalty points again.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <Cpu className="mb-4" />
              <h3 className="font-semibold text-xl mb-3">
                Faster Checkout
              </h3>
              <p className="text-gray-600">
                Open your card instantly and scan it in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="w-[90%] max-w-4xl mx-auto text-center">
          <h2
            className={`text-4xl font-bold mb-6 ${HeaderFont.className}`}
          >
            Start Earning Every Reward
          </h2>

          <p className="text-lg text-gray-600 mb-10">
            Store your loyalty cards, organise your shopping lists and make
            every grocery trip simpler with Grossary.
          </p>

          <Link href="/auth/signup">
            <SignUpButton>
              <span className="px-10">
                Get Started Free
              </span>
            </SignUpButton>
          </Link>
        </div>
      </section>
    </>
  );
}