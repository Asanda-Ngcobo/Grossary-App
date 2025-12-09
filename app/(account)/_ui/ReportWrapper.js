"use client";
import { useState, useMemo } from "react";
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

function ReportsWrapper({ allLists, allItems }) {
  const [duration, setDuration] = useState(30);

  // ✅ filter lists
  const filteredLists = useMemo(() => {
    if (duration === "all") return allLists;
    const cutoffDate = new Date(Date.now() - duration * 24 * 60 * 60 * 1000);
    return allLists.filter((list) => new Date(list.shopped_at) >= cutoffDate);
  }, [allLists, duration]);

  // ✅ filter items
  const filteredItems = useMemo(() => {
    if (duration === "all") return allItems;
    const cutoffDate = new Date(Date.now() - duration * 24 * 60 * 60 * 1000);
    return allItems.filter((item) => new Date(item.created_at) >= cutoffDate);
  }, [allItems, duration]);

  // ✅ line chart data
  const chartData = useMemo(() => {
    return filteredLists
      .map((list) => ({
        date: new Date(list.shopped_at).toLocaleDateString("en-ZA", {
          month: "short",
          day: "numeric",
        }),
        spent: list.money_spent,
      }))
      .sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  }, [filteredLists]);

  // ✅ pie chart data with "Other" grouping
  const categoryData = useMemo(() => {
    const categoryTotals = {};
    let totalSpending = 0;

    filteredItems.forEach((item) => {
      if (!item.item_category) return;
      categoryTotals[item.item_category] =
        (categoryTotals[item.item_category] || 0) + item.total_price;
      totalSpending += item.total_price;
    });

    const rawData = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      percentage: (value / totalSpending) * 100,
    }));

    const major = rawData.filter((c) => c.percentage >= 5);
    const minor = rawData.filter((c) => c.percentage < 5);

    if (minor.length > 0) {
      const otherTotal = minor.reduce((sum, c) => sum + c.value, 0);
      major.push({ name: "Other", value: otherTotal });
    }

    return major;
  }, [filteredItems]);

  // ✅ totals
  const moneySpent = filteredLists.reduce((sum, l) => sum + (l.money_spent || 0), 0);
  const moneySaved = filteredLists.reduce((sum, l) => sum + (l.money_left || 0), 0);
  const totalBudget = filteredLists.reduce((sum, l) => sum + (l.list_budget || 0), 0);

  const savedPercentage = totalBudget
    ? ((moneySaved / totalBudget) * 100).toFixed(2)
    : 0;

  const moneySavedFormatted = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(moneySaved);

  const COLORS = ["#EDE734", "#FF8042", "#0088FE", "#00C49F", "#FFBB28", "#A569BD"];

  return (
    <div className="py-2 px-4 rounded-md w-[90%] mt-2 
      ml-[5%] lg:w-[80%] lg:ml-[5%] lg:mx-0 gap-6">
      <ReportDuration onChange={(val) => setDuration(val)} />
         <section className=" rounded-2xl border-2 border-gray-600 shadow-sm">
      

      

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
     <MoneySpent moneySpent={moneySpent}/>

        <MoneySaved moneySaved={moneySaved}
        savedPercentage={savedPercentage}/>

        <div className="pb-2 h-[80px]  grid justify-center items-center">
          <h2 className="text-2xl md:text-4xl font-bold text-center">
            {filteredLists.length}
          </h2>
          <p className="text-sm text-gray-600 font-semibold text-center">Lists Shopped</p>
        </div>
      </div>

      {/* Line Chart
      <div className="mt-6 bg-[#04284B] p-4 rounded-lg">
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
      </div> */}

      {/* Pie Chart */}
      {/* <div className="mt-6 bg-[#04284B] p-4 rounded-lg">
        <h2 className="text-[#8F8C8C] text-lg mb-2">Spending by Category</h2>
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
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div> */}
    </section>
    </div>
   
  );
}

export default ReportsWrapper;
