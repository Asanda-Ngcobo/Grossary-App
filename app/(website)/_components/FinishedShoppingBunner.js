import { Check } from "@deemlol/next-icons"
import { Lexend_Deca } from 'next/font/google';


const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

function FinishedShoppingBunner() {
    return (
        <div
  className="
    fixed mt-[50%] left-1/2 -translate-x-1/2 z-50
    w-[90%] max-w-lg bg-[#041527] text-white
    rounded-2xl shadow-lg px-6 py-8
    flex flex-col items-center text-center space-y-4
    animate-fade-in
  "
>
  <div className="w-20 h-20 flex justify-center items-center rounded-full bg-green-500 shadow-md animate-pulse">
    <Check className="text-white text-4xl" />
  </div>

 
    
      {/* <FireworksComponent /> */}
      <h1 className="text-2xl font-bold text-green-400 animate-bounce">
        Well Done Keketso!
      </h1>
      <p className="text-base">
        Your shopping is done and you managed to stay&nbsp;
        <span className="font-bold text-green-300">
          11.7%
        </span> under budget. 🎉😊
      </p>
       <div className={`${ButtonFont.className} 
   grid gap-6 mt-11 mx-4 `}>
     <button
     
      className="h-10 min-w-[300px] px-2  bg-[#A2B06D]  cursor-pointer  rounded-lg text-[#04284B]
      font-semibold hover:bg-[#041527] transition-colors"
    >
      View Virtual Slip
    
    </button>
    <button
 

      className="h-10 min-w-[300px] px-2 rounded-lg 
      cursor-pointer border bg-transparent text-gray-400 border-[#04284B]  font-semibold hover:opacity-70 transition-all"
    >
     Continue Shopping
    </button>
   
    
  </div>
  

</div>
    )
}

export default FinishedShoppingBunner
