'use client'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Quicksand } from "next/font/google";
import UserOne from '@/public/Cool Student.png';
import BuildFor from "./BuildFor";

const users = [
  {
    image: UserOne,
    name: 'Lerato',
    age: 25,
    occupation: 'Digital Marketer',
    id: 1
  },
  {
    image: UserOne,
    name: 'Thabo',
    age: 22,
    occupation: 'Fitness Trainer',
    id: 2
  },
];

const HeaderFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
});

export default function BuiltForWho() {
  return (
    <div className="w-full bg-[#041527] h-[100vh">
      <h1
        className={`text-[20px] font-bold mb-8 text-center text-[#A2B06D] ${HeaderFont.className}`}
      >
        Who Is Grossary Built For?
      </h1>
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={10000}
        showArrows={true}
        showStatus={false}
      >
        {users.map((potentials) => (
          <BuildFor userinfo={potentials} key={potentials.id} />
        ))}
      </Carousel>
    </div>
  );
}
