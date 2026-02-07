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
  
  const totalBudget = filteredLists.reduce((sum, l) => sum + (l.list_budget || 0), 0);
  const moneySaved = totalBudget - moneySpent;

  const savedPercentage = totalBudget
    ? ((moneySaved / totalBudget) * 100).toFixed(2)
    : 0;


  const COLORS = ["#EDE734", "#FF8042", "#0088FE", "#00C49F", "#FFBB28", "#A569BD"];

  

  return (
    <div className="py-2 px-4 rounded-md  mt-2 
       lg:w-[80%] lg:ml-[5%] lg:mx-0 gap-6">
      <ReportDuration onChange={(val) => setDuration(val)} />
         <section className=" ">
      

      

      {/* Stats */}
      <div className=" gap-2">
           <div 
        className="p-2 h-[80px]
     flex-col justify-center items-center rounded-lg">

       {/* Total Budget */}
          <h2 className="text-2xl md:text-4xl font-bold text-center">
            R{totalBudget}
          </h2>
         
          <p className="text-sm text-gray-600 font-semibold text-center">Total Budget</p>
        </div>

        <div className="w-[90%] mx-auto flex justify-between">
           <MoneySpent moneySpent={moneySpent}/>

        <MoneySaved moneySaved={moneySaved}
        savedPercentage={savedPercentage}/>
        </div>
    

     
      </div>

       {/* Line Chart */}
      {/* <div className="mt-6 bg-[#04284B] p-4 rounded-lg">
        <h2 className="text-[#8F8C8C] text-lg mb-2">Money Spent Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A3F57" />
            <XAxis dataKey="date" stroke="#8F8C8C" />
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
            <Line
              type="monotone"
              dataKey="spent"
              stroke="#ACF532"
              strokeWidth={3}
              dot={{ r: 4, fill: "#ACF532" }}
              activeDot={{ r: 6, fill: "#FFD700" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>  */}
      
      {/* TOGGLE BUTTONS */}
      <div className="flex justify-between items-center
        w-[80%] mx-[10%] bg-gray-600 text-gray-500 
        h-10 my-4 rounded-3xl
        font-bold
        lg:w-[30%] lg:ml-[10%]
        
     ">
        <button onClick={toggleActive}
         className={`w-[50%] ml-1  h-8  rounded-3xl cursor-pointer ${ButtonFont.className}   ${
            !active ? "bg-[#ACF532]" : "bg-gray-600"
          }`}>Active Lists <span className={`absolute rounded-full
            text-gray-900 -mt-0.5 w-4 h-4 text-[10px] ${!active ? 
          'bg-gray-600': 'bg-[#ACF532]'}`}>{activeList.length}</span></button>
        <button onClick={toggleActive}
           className={`w-[50%] mr-1  h-8  rounded-3xl cursor-pointer  ${ButtonFont.className}  ${
            active ? "bg-[#ACF532] w-[55%]" : "bg-gray-600"
          }`}>Shopped Lists</button>
      </div>

         {/* LISTS */}
      <Suspense fallback={<Loading />}>
        <Lists myLists={myLists} userId={userId} active={active} />
      </Suspense>

      {/* Pie Chart */}

      
      {/* <div className="mt-6  p-4 rounded-lg">
        <h2 className="text-[#8F8C8C] text-sm md:text-lg mb-2">Spending by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
              fontSize={9}
              marginTop={20}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat("en-ZA", {
                  style: "currency",
                  currency: "ZAR",
                }).format(value)
              }
            />
            <Legend   wrapperStyle={{
    fontSize: "12px",
    marginTop: '12px',
  }} />
          </PieChart>
        </ResponsiveContainer>
      </div>  */}
    </section>
    </div>
   
  );
}

export default ReportsWrapper;
