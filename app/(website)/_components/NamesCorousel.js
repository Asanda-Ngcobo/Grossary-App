'use client'

import { Carousel } from "react-responsive-carousel";

const names = [
  { name: "Koketso", id: 1 },
  { name: "Nomthandazo", id: 2 },
  { name: "Sphamandla", id: 3 },
  { name: "Puleng", id: 4 },
  { name: "Nonjabulo", id: 5 },
  { name: "Thabo", id: 6 },
  { name: "Ayanda", id: 7 },
  { name: "Sipho", id: 8 },
  { name: "Lerato", id: 9 },
  { name: "Themba", id: 10 },
  { name: "Naledi", id: 11 },
  { name: "Bongani", id: 12 },
  { name: "Zanele", id: 13 },
  { name: "Karabo", id: 14 },
  { name: "Tshepo", id: 15 },
  { name: "Noluthando", id: 16 },
  { name: "Sibusiso", id: 17 },
  { name: "Lindiwe", id: 18 },
  { name: "Itumeleng", id: 19 },
  { name: "Nomsa", id: 20 },
  { name: "Kgosi", id: 21 },
  { name: "Boitumelo", id: 22 },
  { name: "Nandi", id: 23 },
  { name: "Tebogo", id: 24 },
  { name: "Gugu", id: 25 },
  { name: "Katlego", id: 26 },
  { name: "Phumelele", id: 27 },
  { name: "Mpho", id: 28 },
  { name: "Yolanda", id: 29 },
  { name: "Thandeka", id: 30 },
  { name: "Lunga", id: 31 },
  { name: "Mbali", id: 32 },
  { name: "Simphiwe", id: 33 },
  { name: "Nokuthula", id: 34 },
  { name: "Rethabile", id: 35 },
  { name: "Onke", id: 36 },
  { name: "Khanyisa", id: 37 },
  { name: "Anathi", id: 38 },
  { name: "Siyabonga", id: 39 },
  { name: "Zodwa", id: 40 },
  { name: "Thuli", id: 41 },
  { name: "Lebo", id: 42 },
  { name: "Makhosi", id: 43 },
  { name: "Nokwanda", id: 44 },
  { name: "Wandile", id: 45 },
  { name: "Tumelo", id: 46 },
  { name: "Banele", id: 47 },
  { name: "Nosipho", id: 48 },
  { name: "Sanele", id: 49 },
  { name: "Kea", id: 50 },
  { name: "Andile", id: 51 },
  { name: "Nhlanhla", id: 52 },
  { name: "Amahle", id: 53 },
  { name: "Zenande", id: 54 },
  { name: "Melokuhle", id: 55 },
  { name: "Jabulani", id: 56 },
  { name: "Buhle", id: 57 },
  { name: "Musa", id: 58 },
  { name: "Tumi", id: 59 },
  { name: "Nomvelo", id: 60 },
  { name: "Khanyisile", id: 61 },
  { name: "Thandiswa", id: 62 },
  { name: "Siphesihle", id: 63 },
  { name: "Mlungisi", id: 64 },
  { name: "Nkanyezi", id: 65 },
  { name: "Ziyanda", id: 66 },
  { name: "Nosihle", id: 67 },
  { name: "Precious", id: 68 },
  { name: "Ashley", id: 69 },
  { name: "Jason", id: 70 },
  { name: "Morne", id: 71 },
  { name: "Jaco", id: 72 },
  { name: "Pieter", id: 73 },
  { name: "Hendrik", id: 74 },
  { name: "Elmarie", id: 75 },
  { name: "Anneline", id: 76 },
  { name: "Charl", id: 77 },
  { name: "Riaan", id: 78 },
  { name: "Natasha", id: 79 },
  { name: "Candice", id: 80 },
  { name: "Thuli", id: 81 },
  { name: "Dineo", id: 82 },
  { name: "Nokwazi", id: 83 },
  { name: "Khumo", id: 84 },
  { name: "Tshegofatso", id: 85 },
  { name: "Zintle", id: 86 },
  { name: "Reabetswe", id: 87 },
  { name: "Noxolo", id: 88 },
  { name: "Tsholofelo", id: 89 },
  { name: "Lesedi", id: 90 },
  { name: "Ofentse", id: 91 },
  { name: "Kutlwano", id: 92 },
  { name: "Omphile", id: 93 },
  { name: "Mmabatho", id: 94 },
  { name: "Modise", id: 95 },
  { name: "Xolani", id: 96 },
  { name: "Lukhanyo", id: 97 },
  { name: "Sakhile", id: 98 },
  { name: "Ntokozo", id: 99 },
  { name: "Zamokuhle", id: 100 },
];


function NamesCarousel() {
  return (
    <div className="w-fit max-w-[200px] mx-auto">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={1500}
        showArrows={false}
        showStatus={false}
        showIndicators={false}
        swipeable={false}
        stopOnHover={false}
      >
        {names.map((person) => (
          <div key={person.id}>
            <div className="text-xs text-center text-white font-semibold">
              {person.name}!
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default NamesCarousel;
