'use client'
import { ChevronLeft, Plus } from "@deemlol/next-icons"
import Link from "next/link"
import AddCardClient from "./AddCardClient"
import CardList from "./CardList"
import { useForm } from "@/app/providers/Provider"
import ParentFormBackground from "./ParentFormBackground"

function CardsClient({cards}) {

     const { formOpen, toggleForm,
         active } = useForm();
    return (
         <div className="p-4 max-w-md mx-auto">
      <div className='flex flex-row justify-between w-full'> 
        <div><button className="bg-white
                  cursor-pointer active:bg-gray-600
                   text-black rounded-full w-10 h-10
                    flex items-center justify-center"
                    >
                      <Link href={`/account`}>
          <ChevronLeft />
            </Link>
                    
                  </button></div>
         <div>                  <h1 className="text-xl font-bold my-4">My Cards</h1></div>
</div>

  

      {/* Card List */}
    <CardList cards={cards}/>
 {/* ADD Card FORM */}
        {formOpen && (
          <ParentFormBackground openform={toggleForm}>
            <AddCardClient toggleForm={toggleForm} />
          </ParentFormBackground>
        )}
        {!active && (
            <div className='bottom-0 right-2 fixed '>
            <button className="flex 
                            justify-center items-center 
                            mx-3
                            w-[40px]
                            h-[40px]
                            rounded-full
                            bg-amber-700 
                            text-gray-500
                            cursor-pointer
                            my-6" onClick={toggleForm}>
                            <Plus/></button>
          </div>
       
          )}
    </div>
    )
}

export default CardsClient
