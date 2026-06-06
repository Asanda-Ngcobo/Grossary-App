'use client'

import Link from "next/link"
import { SubmitButton } from "./ReUseButton"

import { reuseList } from "@/app/_lib/actions";
import ListNavigation from "./ListsNav";

function HistoryClient({ History, userId }) {
  // Group history items by "Month Year" and calculate totals
  const groupedHistory = History.reduce((acc, item) => {
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
    <div className="w-full mx-auto lg:w-[80%] lg:ml-[5%] mt-25 ">
      <ListNavigation/>
      {History.length === 0 ? (
        <p>You have no Shopped Lists yet.</p>
      ) : (
        <div>
          {Object.entries(groupedHistory).map(([monthYear, data]) => (
            <div key={monthYear} className="mb-6">
              <div className="flex flex-row justify-between ">
<h2 className="text-sm font-bold text-gray-400 mb-2">{monthYear}</h2>

              {/* Monthly totals */}
              <div className="mb-2 ml-1  text-xs  text-gray-600  flex gap-2">
                <p>Total Spent: <span className="font-extrabold text-[#ACF532]">R{data.totalSpent.toFixed(2)}</span></p>
             
              </div>
              
              </div>

              <ul>
                {data.items.map((history) => (
                  <li
                    key={history.id} className=" 
                     w-full flex justify-center items-center text-black"
                  >

                    {/* Left: Icon */}

                     <Link href={`/account/forms/${history.id}/list-summary`}
                    className="w-full flex justify-between items-center gap-2"> 
                   
                     

                             <div className="flex flex-col items-center py-4 px-2">
                      
                     <h1 className="font-bold text-md ">{history.list_name}</h1>

                    {/* Middle: Info */}
                    <div className="flex justify-between">
                     
                      <p className="text-sm font-semibold">
                        {new Date(history.shopped_at).toLocaleDateString('en-GB')},{" "}
                        
                      </p>
                      <p className="text-sm">R{history.money_spent}</p>
                    </div>

                  

           
                   
                     
                    

                    </div>
                  
            
                      </Link>
               {/* ReUse Button */}
                    <form action={reuseList.bind(null, history.id, userId)} className="flex gap-2 w-[20%]">
                      <SubmitButton />
                    </form>
                   
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
