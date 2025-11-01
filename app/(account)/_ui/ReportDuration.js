"use client";
import { Lexend_Deca } from "next/font/google";
import { useState } from "react";

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: "swap",
});

const durationOptions = [
  { id: 1, value: 30, label: "Last 30 Days" },
  { id: 2, value: 60, label: "2 Months" },
  { id: 3, value: 90, label: "3 Months" },
  { id: 4, value: 180, label: "6 Months" },
  { id: 5, value: 365, label: "1 Year" },
  { id: 6, value: "all", label: "All Time" },
];

function  ReportDuration({ onChange }) {
  const [active, setActive] = useState(30); // ✅ default to 30 days

  const handleClick = (value) => {
    setActive(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="overflow-x-auto no-scrollbar m-2">
      <div className="flex gap-2 w-max">
        {durationOptions.map((time) => (
          <button
            key={time.id}
            onClick={() => handleClick(time.value)}
            className={`${ButtonFont.className} 
              w-[100px] text-sm flex justify-center items-center py-2 rounded-[50px] shrink-0
              ${active === time.value ? "bg-[#ACF532] text-black font-semibold" : "bg-[#04284B] text-white"}
            `}
          >
            {time.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ReportDuration;
