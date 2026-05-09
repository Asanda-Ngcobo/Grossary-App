'use client'

import { Check, ChevronLeft } from "@deemlol/next-icons";
import { Lexend_Deca } from 'next/font/google';
import DeleteList from "@/app/(account)/_ui/DeleteList";

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

const placeholderCards = [
  {
    id: 1,
    name: "Checkers",
    number: "**** **** 4821",
    color: "bg-gradient-to-r from-green-400 to-green-600"
  },
  {
    id: 2,
    name: "Spar",
    number: "**** **** 1934",
    color: "bg-gradient-to-r from-blue-400 to-blue-600"
  },
  {
    id: 3,
    name: "PnP",
    number: "**** **** 7728",
    color: "bg-gradient-to-r from-purple-400 to-purple-600"
  }
]

export default function LoyaltyCardsClient() {
  return (
  <div className="p-4 max-w-md mx-auto text-black">
            {/* Header */}
            <div className='flex flex-row justify-between w-full'> 
                <div>
                    <button className=" cursor-pointer active:bg-gray-600 text-black rounded-full w-10 h-10 flex items-center justify-center">
                  
                            <ChevronLeft />
                    
                    </button>
                </div>
                <div>
                    <h1 className="hidden lg:flex text-xl font-bold my-4">My Loyalty Cards</h1>
                </div>
            </div>

      

                    {/* Stacked placeholder cards */}
                    <div className="lg:relative mt-6 h-40 w-full">
                        {placeholderCards.map((card, index) => (
                            <div
                                key={card.id}
                                className={`${card.color} text-white absolute w-full h-18 rounded-xl shadow-lg flex flex-col justify-center px-4`}
                                style={{ top: index * 20, left: index * 5, zIndex: placeholderCards.length - index }}
                            >
                                <span className="font-bold text-lg">{card.name}</span>
                                <span className="text-sm">{card.number}</span>
                            </div>
                        ))}
                    </div>
                </div>
              
            

  );
}


