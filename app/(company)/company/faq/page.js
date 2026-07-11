'use client';

import Link from "next/link";
import { Quicksand } from "next/font/google";
import { ChevronDown } from "@deemlol/next-icons";

import SignUpButton from "@/app/(website)/_components/SignUpButton";

const HeaderFont = Quicksand({
  subsets: ["latin"],
});

const faqs = [
  {
    question: "What is Grossary?",
    answer:
      "Grossary is a free grocery shopping list and budgeting app that helps you plan your shopping before you leave home. You can create shopping lists, track your grocery spending, store loyalty cards, compare prices, and organise your groceries by store aisle.",
  },
  {
    question: "Is Grossary a food delivery platform?",
    answer:
      "No. Grossary does not deliver groceries. Instead, it helps you plan your shopping, stay within your budget, organise your grocery lists, store loyalty cards and compare prices before you visit the supermarket.",
  },
  {
    question: "Is Grossary free?",
    answer:
      "Yes. You can create grocery lists, reuse previous lists and organise your shopping for free. Some premium features, such as advanced price comparison, may require a Grossary Plus subscription.",
  },
  {
    question: "Can I reuse my grocery lists?",
    answer:
      "Yes. You can reuse any previous shopping list with a single tap, making monthly and weekly grocery shopping much faster.",
  },
  {
    question: "Can I store my loyalty cards?",
    answer:
      "Yes. Grossary lets you securely store your grocery loyalty cards so you always have them available at the checkout.",
  },
  {
    question: "Can Grossary help me save money?",
    answer:
      "Yes. Planning your shopping, tracking your spending and comparing prices helps reduce impulse purchases and keeps you within your grocery budget.",
  },
  {
    question: "Can I track my grocery spending?",
    answer:
      "Yes. Add prices while you shop to monitor your spending in real time and avoid unexpected totals at the checkout.",
  },
  {
    question: "Does Grossary compare grocery prices?",
    answer:
      "Yes. Grossary Plus helps you compare grocery prices between participating supermarkets so you can find better deals before shopping.",
  },
  {
    question: "Can I use Grossary on my phone?",
    answer:
      "Yes. Grossary works on your phone, making it easy to update your shopping list while you're at home or in the supermarket.",
  },
  {
    question: "Which supermarkets can I use Grossary with?",
    answer:
      "Grossary can be used wherever you shop, including Checkers, Shoprite, Pick n Pay, Woolworths, SPAR, Boxer and many other grocery stores.",
  },
];

export default function FAQPage() {
  return (
    <>
      {/* Hero */}

      <section className="bg-[#0B2E1E] text-white py-28">

        <div className="max-w-5xl mx-auto w-[90%] text-center">

          <h1
            className={`text-4xl lg:text-6xl font-bold ${HeaderFont.className}`}
          >
            Frequently Asked Questions
          </h1>

          <p className="mt-8 text-lg lg:text-xl leading-8 text-gray-200 max-w-3xl mx-auto">
            Learn more about Grossary, how it works, and how it helps you plan
            smarter grocery shopping while staying within your budget.
          </p>

        </div>

      </section>

      {/* FAQ */}

      <section className="py-24">

        <div className="max-w-4xl mx-auto w-[90%]">

          <div className="space-y-6">

            {faqs.map((faq) => (

              <details
                key={faq.question}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >

                <summary className="flex cursor-pointer list-none items-center justify-between">

                  <h2 className="text-lg lg:text-xl font-semibold">
                    {faq.question}
                  </h2>

                  <ChevronDown className="transition group-open:rotate-180" />

                </summary>

                <p className="mt-5 text-gray-600 leading-8">
                  {faq.answer}
                </p>

              </details>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="bg-gray-50 py-24">

        <div className="max-w-3xl mx-auto w-[90%] text-center">

          <h2
            className={`text-3xl lg:text-5xl font-bold ${HeaderFont.className}`}
          >
            Ready to Shop Smarter?
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Create your free Grossary account and start organising your grocery
            shopping, tracking your spending and saving money today.
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