import Logo from "@/app/(website)/_components/Logo"
import { Lexend_Deca } from "next/font/google";
import Link from "next/link"

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

async function Slip({list,listItems, listId}) {

   const savedPercentage = Number(list.money_left / list.list_budget * 100).toFixed(2)
    return (
        <div className="mt-10 w-[90%] mx-[5%]">
            <div className="flex justify-center"> <Logo/></div>
            <p className="text-center text-sm">WhatsApp: +27 72 124 7120</p>
            <h2 className="text-gray-500 text-center ">Your digital Grocery
                 Slip for <span>{list.list_name} </span>
                 shopped at
                  <span> {new Date(list.shopped_at).toLocaleDateString('en-GB')},{" "}</span>
            </h2>
           
            {listItems.map((listitem)=>
            <ul key={listitem.id} >
                <li className="flex text-white text-sm py-1 ">
                    <span className="w-2/5 flex gap-1">
                    {listitem.item_name}{listitem.item_volume_mass}{listitem.item_unit}</span>
                    <span className="w-1/5">{listitem.item_quantity}</span>
                    <span className="w-1/5">R{listitem.price}</span>
                    <span className="w-1/5">R{listitem.total_price}</span></li> 
                </ul>
            )}
            <div className="w-[90%] mx-[5%]">
                <h1 className="text-2xl text-gray-600"> You can now go to the till</h1>
                <table>
                   <thead>
          <tr className="text-left">
            <th  className=" p-2 w-1/3">Budget</th>
            <th  className=" p-2 w-1/3">Money Spent (Approx)</th>
            <th  className=" p-2 w-1/3">Money Saved (Approx)</th>
            
          </tr>
        </thead>
        <tbody>
            <tr>
                <td className=" p-2 w-1/3">R{list.list_budget}</td>
                 <td className=" p-2 w-1/3">R{list.money_spent}</td>
                  <td className=" p-2 w-1/3">R{list.money_left} <span className="text-xs text-gray-500">{savedPercentage}%</span></td>
            </tr>
        </tbody>
                  
                </table>
              
            </div>
                  <div className={`${ButtonFont.className} 
   grid gap-6 mt-11 mx-4 `}>
     <button
     
      className="h-10 min-w-[300px] px-2  bg-[#A2B06D]  cursor-pointer  rounded-lg text-[#04284B]
      font-semibold hover:bg-[#041527] transition-colors"
    >
      <Link href={`/account/lists/history`}>  Finish Shopping</Link>
    
    </button>
    <button
   

      className="h-10 min-w-[300px] px-2 rounded-lg 
      cursor-pointer border bg-transparent text-gray-400 border-[#04284B]  font-semibold hover:opacity-70 transition-all"
    >
         <Link href={`/account/forms/${listId}`}>  Continue Shopping</Link>
   
    </button>
   
   <button
   

      className="h-10 min-w-[300px] px-2 rounded-lg 
      cursor-pointer border bg-transparent text-gray-400 border-[#04284B]  font-semibold hover:opacity-70 transition-all"
    >
         <Link href={`/account/forms/`}>  Report Issue or Add Suggestion</Link>
   
    </button>
    
  </div>
        </div>
    )
}

export default Slip
