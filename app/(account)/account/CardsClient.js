'use client'
import { ChevronLeft, Plus } from "@deemlol/next-icons"
import Link from "next/link"
import AddCardClient from "./AddCardClient"
import CardList from "./CardList"
import { useForm } from "@/app/providers/Provider"
import ParentFormBackground from "./ParentFormBackground"

function CardsClient({ cards }) {
    const { formOpen, toggleForm, active } = useForm();

    // Dummy placeholder cards when none exist
    const placeholderCards = [
        { id: 1, name: "Checkers Xtra Savings", number: "•••• 9012", color: "bg-[#38A8AE]" },
        { id: 3, name: "SPAR Rewards", number: "•••• 1234", color: "bg-red-500" },
        { id: 2, name: "Pick n Pay Smart Shopper", number: "•••• 5678", color: "bg-blue-500" },
        
    ];

    return (
        <div className="p-4 max-w-md mx-auto">
            {/* Header */}
            <div className='flex flex-row justify-between w-full'> 
                <div>
                    <button className="bg-white cursor-pointer active:bg-gray-600 text-black rounded-full w-10 h-10 flex items-center justify-center">
                        <Link href={`/account`}>
                            <ChevronLeft />
                        </Link>
                    </button>
                </div>
                <div>
                    <h1 className="text-xl font-bold my-4">My Loyalty Cards</h1>
                </div>
            </div>

            {/* Empty State Message */}
            {cards.length === 0 &&  
                <div className='lg:w-[80%] mx-[10%]'>
                    <p>
                        You have no <span className="font-bold">cards added</span> currently.
                        Add your loyalty cards by clicking the bottom right button below.
                    </p>

                    {/* Stacked placeholder cards */}
                    <div className="relative mt-6 h-40 w-full">
                        {placeholderCards.map((card, index) => (
                            <div
                                key={card.id}
                                className={`${card.color} text-white absolute w-full h-24 rounded-xl shadow-lg flex flex-col justify-center px-4`}
                                style={{ top: index * 20, left: index * 5, zIndex: placeholderCards.length - index }}
                            >
                                <span className="font-bold text-lg">{card.name}</span>
                                <span className="text-sm">{card.number}</span>
                            </div>
                        ))}
                    </div>
                </div>
            }

            {/* Card List */}
            <CardList cards={cards} />

            {/* ADD Card FORM */}
            {formOpen && (
                <ParentFormBackground openform={toggleForm}>
                    <AddCardClient toggleForm={toggleForm} />
                </ParentFormBackground>
            )}

            {/* Floating Add Button */}
            {!active && (
                <div className='bottom-0 right-2 fixed'>
                    <button
                        className="flex justify-center items-center mx-3 w-[40px] h-[40px] rounded-full bg-[#1EC677] text-gray-500 cursor-pointer my-6"
                        onClick={toggleForm}
                    >
                        <Plus />
                    </button>
                </div>
            )}
        </div>
    )
}

export default CardsClient