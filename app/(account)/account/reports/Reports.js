"use client";
import { useState, useMemo, Suspense } from "react";

import {
  
  BarChart,
  Bar,
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

import { useForm } from "@/app/providers/Provider";
import { Lexend_Deca } from "next/font/google";
import Link from "next/link";

import MoneySpent from "../../_ui/MoneySpent";
import ReportDuration from "../../_ui/ReportDuration";
import { ChevronLeft } from "@deemlol/next-icons";

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

function Reports({ allLists, allItems
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
  const monthlyTotals = {};

  filteredItems.forEach((item) => {
    const date = new Date(item.purchased_at);

    const monthKey = date.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
    }); // e.g. "Apr 2026"

    monthlyTotals[monthKey] =
      (monthlyTotals[monthKey] || 0) + Number(item.total_price || 0);
  });

  return Object.entries(monthlyTotals)
    .map(([month, total]) => ({
      month,
      total,
    }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));
}, [filteredItems]);
// ✅ pie chart data with "Other" grouping (2 decimal places)
const categoryList = useMemo(() => {
  const totals = {};
  let total = 0;

  filteredItems.forEach((item) => {
    if (!item.item_category || !item.total_price) return;

    const price = Number(item.total_price);

    totals[item.item_category] =
      (totals[item.item_category] || 0) + price;

    total += price;
  });

  return Object.entries(totals)
    .map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
      percentage: total
        ? Number(((value / total) * 100).toFixed(1))
        : 0,
    }))
    .sort((a, b) => b.value - a.value); // biggest first 🔥
}, [filteredItems]);

 
 


  // ✅ totals
  const moneySpent = filteredItems.reduce((sum, l) => sum + (l.total_price || 0), 0);


  
  // const totalBudget = filteredLists.reduce((sum, l) => sum + (l.list_budget || 0), 0);
  // const moneySaved = totalBudget - moneySpent;

  // const savedPercentage = totalBudget
  //   ? ((moneySaved / totalBudget) * 100).toFixed(2)
  //   : 0;


  const COLORS = ["#EDE734", "#FF8042", "#0088FE", "#00C49F", "#FFBB28", "#A569BD"];

  

  return (
    <div className="py-2 px-4 rounded-md  mt-2 
       lg:w-[80%] lg:ml-[10%] lg:mx-0 gap-6">
  <button className=" cursor-pointer active:bg-gray-600 text-black rounded-full w-10 h-10 flex items-center justify-center">
                        <Link href={`/account`}>
                            <ChevronLeft />
                        </Link>
                    </button>
        <div className="flex flex-col w-full h-[30vh] rounded-md bg-[]">
            
          {/* Stats */}
      <div className=" gap-4 rounded-2xl w-full h-fit flex flex-col justify-center items-center ">
    

           <MoneySpent moneySpent={moneySpent}/>


     
      </div>
<ReportDuration onChange={(val) => setDuration(val)} />
        </div>
    
         
      

      

     
       {/* Bar Chart */}
<div className="mt-6 p-4 rounded-lg">
  <h2 className="text-[#8F8C8C] text-lg mb-2">
    Monthly Spending
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" stroke="" />

      <XAxis dataKey="month" stroke="#8F8C8C" />
      <YAxis stroke="#8F8C8C" />

      <Tooltip
        contentStyle={{ backgroundColor: "#041527", border: "none" }}
        labelStyle={{ color: "#ACF532" }}
        formatter={(value) =>
          new Intl.NumberFormat("en-ZA", {
            style: "currency",
            currency: "ZAR",
          }).format(value)
        }
      />

      <Bar
        dataKey="total"
        fill="#ACF532"
        radius={[6, 6, 0, 0]} // rounded top bars 🔥
      />
    </BarChart>
  </ResponsiveContainer>
</div>
      


      {/* Spend Per  Cat */}

      
       <div className="mt-6 p-4 rounded-lg">
  <h2 className="text-[#8F8C8C] text-sm md:text-lg mb-4">
    Spending by Category
  </h2>

  <div className="space-y-4">
    {categoryList.map((cat, index) => (
      <div key={index} className="flex flex-col gap-1">
        
        {/* Top row */}
        <div className="flex justify-between items-center">
          <span className="text-white text-sm">
            {cat.name}
          </span>

          <span className="text-[#ACF532] text-sm font-medium">
            {new Intl.NumberFormat("en-ZA", {
              style: "currency",
              currency: "ZAR",
            }).format(cat.value)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-[#1C2E45] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#ACF532]"
            style={{ width: `${cat.percentage}%` }}
          />
        </div>

        {/* Percentage */}
        <div className="text-xs text-gray-400">
          {cat.percentage}%
        </div>
      </div>
    ))}
  </div>
</div>
    
    </div>
   
  );
}

export default Reports;
