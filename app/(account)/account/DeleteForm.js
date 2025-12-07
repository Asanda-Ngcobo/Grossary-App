import SpinnerMini from "@/app/(website)/_components/SpinnerMini"
import {useTransition } from "react"
import { Lexend_Deca } from "next/font/google";



const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

function DeleteForm({ listId, onDelete,listname, handleModal}) {
     const [isPending, startTransition] = useTransition()
  function handleDelete(){
  
    startTransition(()=>onDelete(listId))

  }
    return (
     <div className="w-[90%] mx-auto mt-[50%] h-[40%] md:mt-[20%] md:w-[50%]
     md-[25%]
      bg-[#04284B] text-white rounded-2xl z-50 flex flex-col justify-between p-6">
  {/* Confirmation Text */}
  <div className="text-center">
    <h2 className="text-3xl font-semibold mb-2">Are you sure you want to delete this list?</h2>
    <p className="text-lg text-[#E32227]">{listname}</p>
  </div>

  {/* Buttons */}
  <div className={`${ButtonFont.className} flex justify-center gap-6 `}>
    <button
      onClick={handleModal}
      className="h-10 w-32 border border-[#041527] cursor-pointer text-gray-400 rounded-lg bg-transparent hover:bg-[#041527] transition-colors"
    >
      Cancel
    </button>
    <button
      onClick={handleDelete}
      className="h-10 w-32 rounded-lg cursor-pointer bg-[#A2B06D] text-[#04284B] font-semibold hover:opacity-70 transition-all"
    >
      {isPending ? <SpinnerMini /> : 'Delete'}
    </button>
  </div>
</div>

    )
}

export default DeleteForm
