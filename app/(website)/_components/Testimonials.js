"use client";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import TestimonialBunner from "./TestimonialBunner";
import { Quicksand } from "next/font/google";

const testimonials = [
  {
    testimonial:
      "Meal prep used to feel chaotic. Now I track everything in Grossary and stay within budget every week without thinking about it.",
    name: "Lerato",
    occupation: "Digital Marketer",
    id: 1,
  },
  {
    testimonial:
      "It’s simple but powerful. I always know exactly how much I’m spending before I even get to the till.",
    name: "Sibusiso",
    occupation: "Electrical Engineer",
    id: 2,
  },
  {
    testimonial:
      "Between school lunches and household groceries, things add up fast. Grossary helps me stay in control of every rand.",
    name: "Thandi",
    occupation: "Mother of 2 · Project Manager",
    id: 3,
  },
];

const HeaderFont = Quicksand({
  subsets: ["latin"],
  display: "swap",
});

function Testimonials() {
  return (
    <section className="w-full py-16 px-4 flex flex-col items-center bg-gradient-to-b from-white to-gray-50">
      
      <h2
        className={`text-2xl md:text-3xl font-semibold text-center text-gray-900 mb-10 ${HeaderFont.className}`}
      >
        Trusted by everyday shoppers
      </h2>

      <p className="text-center text-gray-500 max-w-xl mb-10 text-sm md:text-base">
        From students to professionals, Grossary helps people take control of
        grocery spending without overthinking it.
      </p>

      <div className="w-full max-w-2xl">
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          interval={8000}
          showArrows={false}
          showStatus={false}
          swipeable
          emulateTouch
        >
          {testimonials.map((t) => (
            <TestimonialBunner usertestimonial={t} key={t.id} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}

export default Testimonials;