'use client'

import Link from "next/link"
import { SubmitButton } from "./ReUseButton"
import { Link2, ShoppingBag } from "@deemlol/next-icons"
import { reuseList } from "@/app/_lib/actions";

function HistoryClient({History, userId}) {
    
// Group history items by "Month Year"
const groupedHistory = History.reduce((acc, item) => {
  const date = new Date(item.shopped_at);
  const key = date.toLocaleString('en-GB', { month: 'long', year: 'numeric' }); // e.g., "June 2025"
  
  if (!acc[key]) acc[key] = [];
  acc[key].push(item);

  return acc;
}, {});
    return (
        <div className="w-[90%] ml-[5%] lg:w-[60%] lg:ml-[10%] mt-40 ">
            {History.length === 0 ? (
                <p>You have no History Lists yet. 
            </p>
            ): (
                <div>
                   {Object.entries(groupedHistory).map(([monthYear, items]) => (
  <div key={monthYear} className="mb-6">
    <h2 className="text-lg font-bold text-gray-400 mb-2">{monthYear}</h2>

    <ul>
      {items.map((history) => (
        <li
          key={history.id}
          className="border-b border-b-[#8F8C8C] py-4 px-2 flex items-center gap-4"
        >
          {/* Left: Icon */}
          <div className="w-[60px] flex justify-center items-center">
            <div className="bg-[#E2F3F4] w-[50px] h-[50px] rounded-full flex justify-center items-center">
              <ShoppingBag color="#8F8C8C" />
            </div>
          </div>

          {/* Middle: Info */}
          <div className="flex-1">
            <h1 className="font-bold text-base">{history.list_name}</h1>
            <p className="text-xs font-semibold">
              {new Date(history.shopped_at).toLocaleDateString('en-GB')},{" "}
              R{history.money_spent}
            </p>
          </div>

          {/* ReUse Button */}
         <form action={reuseList.bind(null, history.id, userId)} className="flex gap-2">
  <SubmitButton />
</form>

          
          {/* Link button */}
          <div className="flex gap-2">
         <Link href={`/account/forms/${history.id}`} > <Link2/></Link>
             
            
          </div>
        </li>
      ))}
    </ul>
  </div>
))}

                </div>
            )}
           
        </div>
    )
}

export default HistoryClient
