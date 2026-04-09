"use client";
import { useState, useMemo, Suspense } from "react";
import ReportDuration from "./ReportDuration";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import MoneySpent from "./MoneySpent";
import MoneySaved from "../MoneySaved";
import Loading from "@/app/(account-addlist)/account/forms/add-list/loading";
import Lists from "./Lists";
import { useForm } from "@/app/providers/Provider";
import { Lexend_Deca } from "next/font/google";
import Link from "next/link";
import { BarChart, CreditCard, FastForward, FileText, Rewind } from "@deemlol/next-icons";

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

function ReportsWrapper({ allLists, allItems, myLists, userId,
  activeList
 }) {
  const [duration, setDuration] = useState(30);
  const { 
       active, toggleActive } = useForm();

  // // ✅ filter lists
  const filteredLists = useMemo(() => {
    if (duration === "all") return allLists;
    const cutoffDate = new Date(Date.now() - duration * 24 * 60 * 60 * 1000);
    return allLists.filter((list) => new Date(list.shopped_at) >= cutoffDate);
  }, [allLists, duration]);

  // ✅ filter items
  const filteredItems = useMemo(() => {
    if (duration === "all") return allItems;
    const cutoffDate = new Date(Date.now() - duration * 24 * 60 * 60 * 1000);
    return allItems.filter((item) => new Date(item.purchased_at) >= cutoffDate);
  }, [allItems, duration]);

  // ✅ line chart data
  const chartData = useMemo(() => {
    return filteredItems
      .map((item) => ({
        date: new Date(item.purchased_at).toLocaleDateString("en-ZA", {
          month: "short",
          day: "numeric",
        }),
        spent: item.total_price,
      }))
      .sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  }, [filteredItems]);
// ✅ pie chart data with "Other" grouping (2 decimal places)
const categoryData = useMemo(() => {
  const categoryTotals = {};
  let totalSpending = 0;

  filteredItems.forEach((item) => {
    if (!item.item_category || !item.total_price) return;

    const price = Number(item.total_price);

    categoryTotals[item.item_category] =
      (categoryTotals[item.item_category] || 0) + price;

    totalSpending += price;
  });

  // round total once, at the end
  totalSpending = Number(totalSpending.toFixed(2));

  const rawData = Object.entries(categoryTotals).map(([name, value]) => {
    const roundedValue = Number(value.toFixed(2));
    const percentage =
      totalSpending > 0
        ? Number(((roundedValue / totalSpending) * 100).toFixed(2))
        : 0;

    return {
      name,
      value: roundedValue,
      percentage,
    };
  });

  const major = rawData.filter((c) => c.percentage >= 3);
  const minor = rawData.filter((c) => c.percentage < 3);

  if (minor.length > 0) {
    const otherTotal = Number(
      minor.reduce((sum, c) => sum + c.value, 0).toFixed(2)
    );

    major.push({ name: "Other", value: otherTotal });
  }

  return major;
}, [filteredItems]);


  // ✅ totals
  const moneySpent = filteredItems.reduce((sum, l) => sum + (l.total_price || 0), 0);


  
  // const totalBudget = filteredLists.reduce((sum, l) => sum + (l.list_budget || 0), 0);
  // const moneySaved = totalBudget - moneySpent;

  // const savedPercentage = totalBudget
  //   ? ((moneySaved / totalBudget) * 100).toFixed(2)
  //   : 0;




  

  return (
    <div className="py-2 px-4 rounded-md  mt-2 
       lg:w-[80%] lg:ml-[10%] lg:mx-0 gap-6">

        <div className="flex flex-col w-full h-[30vh] rounded-md bg-[]">
            
          {/* Stats */}
      <div className=" gap-4 rounded-2xl w-full h-fit flex flex-col justify-center items-center ">
    

           <MoneySpent moneySpent={moneySpent}/>

   
    
         <ul className="flex flex-row gap-5 w-[90%] justify-between  mx-auto text-gray-200">

            <li className=" w-[30%] flex justify-center items-center gap-1 border-r  ">
              <Link href='/account/cards' className="flex flex-col justify-center active:text-[#ACF532] active:text-2xl items-center"
             >
          <div className=""><CreditCard width={50}/></div>
           <div className="text-[10px]">Cards</div></Link></li>
          <li className=" w-[30%] flex justify-center items-center gap-1 border-r ">
            <Link href='/account/reports'  className="flex flex-col justify-center active:text-[#ACF532] active:text-2xl items-center" >
          <div className=""><BarChart width={50}/></div>
           <div className="text-[10px]">Charts</div></Link></li>
          
               <li className=" w-[30%] flex  justify-center items-center gap-1 ">
                <Link href='/account/lists/history'  className="flex flex-col justify-center items-center active:text-[#ACF532] active:text-2xl">
          <div className=""><FileText width={50}/></div>
           <div className="text-[10px]">Shopped Lists</div></Link></li>
         </ul>
     
      </div>
<ReportDuration onChange={(val) => setDuration(val)} />
        </div>
    
         
      

         {/* LISTS */}
      <Suspense fallback={<Loading />}>
        <Lists myLists={myLists} allItems={allItems} userId={userId} active={active} />
      </Suspense>

    </div>
   
  );
}

export default ReportsWrapper;
