'use client'

import Link from "next/link"

import { FileText, ShoppingBag } from "@deemlol/next-icons"
import { reuseList } from "@/app/_lib/actions";
import { SubmitButton } from "./lists/ReUseButton";

function HistoryClient({ History, topHistory, userId }) {
  // Group history items by "Month Year" and calculate totals
  const groupedHistory = topHistory.reduce((acc, item) => {
    const date = new Date(item.shopped_at);
    const key = date.toLocaleString('en-GB', { month: 'long', year: 'numeric' });

    if (!acc[key]) {
      acc[key] = {
        items: [],
        totalSpent: 0,
        totalSaved: 0,
      };
    }

    acc[key].items.push(item);
    acc[key].totalSpent += item.money_spent;
    acc[key].totalSaved += (item.money_left); 

    return acc;
  }, {});

  return (
    <div className="w-[90%] ml-[5%] lg:w-[80%] lg:ml-[5%] mt-10 ">
      {History.length === 0 ? (
        <p>You have no Shopped Lists yet.</p>
      ) : (
        <div>
          {Object.entries(groupedHistory).map(([monthYear, data]) => (
            <div key={monthYear} className="mb-6">
              <div className="flex flex-row justify-between ">
<h2 className="text-lg font-bold text-gray-400 mb-2 ">{monthYear}</h2>

              {/* Monthly totals */}
              <div className="mb-2 ml-1  text-xs  text-gray-600  flex gap-2">
                <p>Total Spent: <span className="font-extrabold text-[#ACF532]">R{data.totalSpent.toFixed(2)}</span></p>
                <p>Total Saved: <span className="font-extrabold ">R{data.totalSaved.toFixed(2)}</span></p>
              </div>
              
              </div>

              <ul>
                {data.items.map((history) => (
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
                         <button >
                      <Link href={`/account/forms/${history.id}/list-summary`}
                      className='group
     flex justify-center items-center 
     h-[40px] w-[40px] bg-gray-600
     rounded-full
     active:bg-gray-900
       gap-2 uppercase text-xs cursor-pointer
      font-bold text-gray-500 flex-grow px-3 
      hover:bg-accent-600 transition-colors hover:text-primary-900'>
                        <FileText className=' 
      absolute
      '  />
                      </Link>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryClient
